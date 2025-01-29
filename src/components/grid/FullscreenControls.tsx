import React from 'react';
import { Maximize2, Minimize2, Settings } from 'lucide-react';

interface FullscreenControlsProps {
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
}

const FullscreenControls = ({ isFullscreen, onToggleFullscreen }: FullscreenControlsProps) => {
  return (
    <div className="absolute top-4 right-4 flex items-center gap-2">
      {isFullscreen ? (
        <Minimize2 
          className="w-5 h-5 text-foreground/50 hover:text-foreground/80 cursor-pointer" 
          onClick={onToggleFullscreen}
        />
      ) : (
        <Maximize2 
          className="w-5 h-5 text-foreground/50 hover:text-foreground/80 cursor-pointer" 
          onClick={onToggleFullscreen}
        />
      )}
      <Settings className="w-5 h-5 text-foreground/50 hover:text-foreground/80 cursor-pointer" />
    </div>
  );
};

export default FullscreenControls;