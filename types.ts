
export interface RestorationStatus {
  step: 'idle' | 'analyzing' | 'restoring' | 'colorizing' | 'finalizing' | 'complete' | 'error';
  message: string;
}

export interface ImagePair {
  original: string;
  restored: string | null;
}
