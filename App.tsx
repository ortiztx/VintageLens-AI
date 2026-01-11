
import React, { useState, useCallback, useRef } from 'react';
import { restorePhoto } from './services/geminiService';
import { RestorationStatus, ImagePair } from './types';
import ComparisonSlider from './components/ComparisonSlider';

const App: React.FC = () => {
  const [images, setImages] = useState<ImagePair>({ original: '', restored: null });
  const [status, setStatus] = useState<RestorationStatus>({ step: 'idle', message: '' });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setImages({ original: event.target?.result as string, restored: null });
        setStatus({ step: 'idle', message: 'Image uploaded successfully.' });
      };
      reader.readAsDataURL(file);
    }
  };

  const startRestoration = async () => {
    if (!images.original) return;

    try {
      setStatus({ step: 'analyzing', message: 'Analyzing photo defects and facial features...' });
      
      // Artificial delay for better UX "feeling" of AI working
      await new Promise(r => setTimeout(r, 1500));
      setStatus({ step: 'restoring', message: 'Removing scratches and repairing textures...' });
      
      await new Promise(r => setTimeout(r, 2000));
      setStatus({ step: 'colorizing', message: 'Applying realistic color and skin tones...' });

      const result = await restorePhoto(images.original);
      
      setStatus({ step: 'finalizing', message: 'Finalizing modern enhancements...' });
      await new Promise(r => setTimeout(r, 1000));

      setImages(prev => ({ ...prev, restored: result }));
      setStatus({ step: 'complete', message: 'Restoration completed successfully!' });
    } catch (err) {
      setStatus({ step: 'error', message: 'Restoration failed. Please try a clearer image or check your connection.' });
    }
  };

  const reset = () => {
    setImages({ original: '', restored: null });
    setStatus({ step: 'idle', message: '' });
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const downloadRestored = () => {
    if (!images.restored) return;
    const link = document.createElement('a');
    link.href = images.restored;
    link.download = 'restored-photo.png';
    link.click();
  };

  return (
    <div className="min-h-screen flex flex-col items-center p-4 md:p-8">
      {/* Header */}
      <header className="w-full max-w-5xl text-center mb-12">
        <div className="inline-block px-4 py-1.5 mb-4 bg-blue-500/10 border border-blue-500/20 rounded-full text-blue-400 text-sm font-medium">
          Professional AI Restoration Engine
        </div>
        <h1 className="text-5xl md:text-7xl font-serif font-bold mb-4 bg-gradient-to-r from-white via-neutral-300 to-neutral-500 bg-clip-text text-transparent">
          VintageLens AI
        </h1>
        <p className="text-neutral-400 text-lg max-w-2xl mx-auto">
          Revive your memories with precision. Our expert AI model restores clarity, removes damage, and adds natural color while meticulously preserving authentic facial identity.
        </p>
      </header>

      <main className="w-full max-w-5xl flex flex-col gap-8">
        {!images.original && (
          <div className="group relative w-full aspect-video rounded-2xl border-2 border-dashed border-white/10 flex flex-col items-center justify-center bg-neutral-900/50 hover:bg-neutral-900/80 transition-all cursor-pointer overflow-hidden"
               onClick={() => fileInputRef.current?.click()}>
            <div className="absolute inset-0 bg-gradient-to-b from-blue-500/5 to-transparent pointer-events-none" />
            <div className="p-6 rounded-full bg-white/5 mb-4 group-hover:scale-110 transition-transform">
              <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-blue-400">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
              </svg>
            </div>
            <p className="text-xl font-medium text-white mb-2">Upload an old photograph</p>
            <p className="text-neutral-500 text-sm">JPG, PNG or WEBP up to 10MB</p>
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept="image/*" 
              onChange={handleFileChange}
            />
          </div>
        )}

        {images.original && !images.restored && (
          <div className="grid md:grid-cols-2 gap-8 items-start">
            <div className="space-y-4">
              <div className="rounded-xl overflow-hidden shadow-2xl border border-white/10 bg-black">
                <img src={images.original} alt="Original Preview" className="w-full object-contain max-h-[500px]" />
              </div>
              <div className="flex gap-4">
                <button 
                  onClick={reset}
                  className="px-6 py-3 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white font-medium transition-colors"
                >
                  Change Photo
                </button>
              </div>
            </div>

            <div className="bg-neutral-900/50 rounded-2xl p-8 border border-white/5 flex flex-col justify-center h-full min-h-[400px]">
              <h2 className="text-2xl font-serif font-bold mb-6 text-white">Restoration Settings</h2>
              
              <ul className="space-y-4 mb-8">
                {[
                  "Facial identity preservation",
                  "Deep scratch & stain removal",
                  "AI realistic colorization",
                  "Dynamic range enhancement",
                  "Noise reduction & sharpening"
                ].map((feature, i) => (
                  <li key={i} className="flex items-center gap-3 text-neutral-300">
                    <svg className="text-blue-400 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>

              {status.step === 'idle' || status.step === 'error' ? (
                <button 
                  onClick={startRestoration}
                  disabled={status.step === 'analyzing'}
                  className="w-full py-4 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold text-lg shadow-lg shadow-blue-500/20 transition-all flex items-center justify-center gap-2"
                >
                  Start Restoration
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                </button>
              ) : (
                <div className="space-y-6">
                  <div className="w-full bg-neutral-800 rounded-full h-2.5 overflow-hidden">
                    <div 
                      className="bg-blue-500 h-full transition-all duration-500 ease-out"
                      style={{ 
                        width: status.step === 'analyzing' ? '25%' : 
                               status.step === 'restoring' ? '50%' : 
                               status.step === 'colorizing' ? '75%' : 
                               status.step === 'finalizing' ? '90%' : '100%' 
                      }}
                    />
                  </div>
                  <div className="flex items-center gap-3 text-blue-400 font-medium">
                    <div className="w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
                    {status.message}
                  </div>
                </div>
              )}
              
              {status.step === 'error' && (
                <p className="mt-4 text-red-400 text-sm bg-red-400/10 p-3 rounded-lg border border-red-400/20">
                  {status.message}
                </p>
              )}
            </div>
          </div>
        )}

        {images.restored && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            <div className="flex items-center justify-between">
              <h2 className="text-3xl font-serif font-bold text-white">Results</h2>
              <div className="flex gap-4">
                <button 
                  onClick={reset}
                  className="px-6 py-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-white font-medium transition-colors"
                >
                  Start New
                </button>
                <button 
                  onClick={downloadRestored}
                  className="px-6 py-2 rounded-lg bg-white text-black font-bold hover:bg-neutral-200 transition-colors flex items-center gap-2"
                >
                  Download
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
                  </svg>
                </button>
              </div>
            </div>

            <ComparisonSlider original={images.original} restored={images.restored} />

            <div className="grid md:grid-cols-3 gap-6">
              <div className="p-6 rounded-2xl bg-neutral-900/50 border border-white/5">
                <div className="text-blue-400 mb-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 2v4"/><path d="m16.2 7.8 2.9-2.9"/><path d="M18 12h4"/><path d="m16.2 16.2 2.9 2.9"/><path d="M12 18v4"/><path d="m4.9 19.1 2.9-2.9"/><path d="M2 12h4"/><path d="m4.9 4.9 2.9 2.9"/>
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Identity Preserved</h3>
                <p className="text-neutral-400 text-sm">Our AI ensures facial geometry remains 100% authentic to the original subject.</p>
              </div>
              <div className="p-6 rounded-2xl bg-neutral-900/50 border border-white/5">
                <div className="text-green-400 mb-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="13.5" cy="6.5" r=".5"/><circle cx="17.5" cy="10.5" r=".5"/><circle cx="8.5" cy="7.5" r=".5"/><circle cx="6.5" cy="12.5" r=".5"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.707-.484 2.103-1.206.35-.637.303-1.387-.132-1.928a2.5 2.5 0 0 1 1.916-4.232H20a2 2 0 0 0 2-2V9a7 7 0 0 0-7-7z"/>
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Modern Color</h3>
                <p className="text-neutral-400 text-sm">Palette derived from historical data and lighting analysis for natural vibrancy.</p>
              </div>
              <div className="p-6 rounded-2xl bg-neutral-900/50 border border-white/5">
                <div className="text-purple-400 mb-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 7h-9"/><path d="M14 17H5"/><circle cx="17" cy="17" r="3"/><circle cx="7" cy="7" r="3"/>
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Noise Refinement</h3>
                <p className="text-neutral-400 text-sm">Removed chemical grain and scanning artifacts while maintaining texture.</p>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="w-full max-w-5xl mt-20 pt-8 border-t border-white/10 text-neutral-500 text-sm flex flex-col md:flex-row justify-between items-center gap-4">
        <p>© 2024 VintageLens AI Studio. Built with Gemini 2.5 Intelligence.</p>
        <div className="flex gap-6">
          <a href="#" className="hover:text-white transition-colors">Documentation</a>
          <a href="#" className="hover:text-white transition-colors">Privacy</a>
          <a href="#" className="hover:text-white transition-colors">Terms</a>
        </div>
      </footer>
    </div>
  );
};

export default App;
