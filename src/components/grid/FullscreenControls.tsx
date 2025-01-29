import React, { useState } from 'react';
import { Maximize2, Minimize2, Settings } from 'lucide-react';
import SettingsDialog from './SettingsDialog';

interface FullscreenControlsProps {
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
}

const FullscreenControls = ({ isFullscreen, onToggleFullscreen }: FullscreenControlsProps) => {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  return (
    <>
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
        <Settings 
          className="w-5 h-5 text-foreground/50 hover:text-foreground/80 cursor-pointer" 
          onClick={() => setIsSettingsOpen(true)}
        />
      </div>
      <SettingsDialog 
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />
    </>
  );
};

export default FullscreenControls;