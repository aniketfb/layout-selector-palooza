import React from 'react';
import { Video } from 'lucide-react';

const VideoFeedPlaceholder = () => {
  return (
    <div className="flex-1 flex flex-col items-center justify-center gap-4 h-full">
      <Video className="w-12 h-12 text-foreground/30" />
      <div className="text-center">
        <h3 className="text-lg font-medium text-foreground mb-2">No video feed available</h3>
        <p className="text-sm text-foreground/50">Click settings to configure video feed</p>
      </div>
    </div>
  );
};

export default VideoFeedPlaceholder;