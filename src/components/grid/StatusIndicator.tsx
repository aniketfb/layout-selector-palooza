import React from 'react';

const StatusIndicator = () => {
  return (
    <div className="absolute top-4 left-4 flex items-center gap-2">
      <div className="w-2 h-2 rounded-full bg-green-500" />
      <span className="text-sm text-foreground/80">Operational</span>
    </div>
  );
};

export default StatusIndicator;