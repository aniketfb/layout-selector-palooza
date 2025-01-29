import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useState, useRef, useEffect } from "react";
import StatusIndicator from "./grid/StatusIndicator";
import FullscreenControls from "./grid/FullscreenControls";
import VideoFeedPlaceholder from "./grid/VideoFeedPlaceholder";

interface GridCardProps {
  id: string;
  content: string;
}

const GridCard = ({ id }: GridCardProps) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition: transition || 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
  };

  useEffect(() => {
    const element = cardRef.current;
    
    const handleFullscreenChange = () => {
      const isDocumentFullscreen = document.fullscreenElement !== null || 
        (document as any).webkitFullscreenElement !== null;
      const isCardFullscreen = document.fullscreenElement === element || 
        (document as any).webkitFullscreenElement === element;
      
      setIsFullscreen(isDocumentFullscreen && isCardFullscreen);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
    };
  }, []);

  const toggleFullscreen = async () => {
    if (!cardRef.current) return;

    try {
      if (!isFullscreen) {
        if (cardRef.current.requestFullscreen) {
          await cardRef.current.requestFullscreen();
        } else if ((cardRef.current as any).webkitRequestFullscreen) {
          await (cardRef.current as any).webkitRequestFullscreen();
        }
      } else {
        if (document.exitFullscreen) {
          await document.exitFullscreen();
        } else if ((document as any).webkitExitFullscreen) {
          await (document as any).webkitExitFullscreen();
        }
      }
    } catch (err) {
      console.error('Error toggling fullscreen:', err);
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={isFullscreen ? undefined : style}
      {...attributes}
      {...(isFullscreen ? {} : listeners)}
      className={`
        relative flex flex-col
        ${isFullscreen 
          ? 'fixed inset-0 z-50 w-screen h-screen m-0 p-6 bg-background'
          : `
            bg-card rounded-lg border border-border p-4 
            transition-all duration-500 ease-in-out
            h-full min-h-[200px] hover:border-primary/50 cursor-move
          `
        }
      `}
    >
      <div 
        ref={cardRef}
        className="w-full h-full relative"
      >
        <StatusIndicator />
        <FullscreenControls 
          isFullscreen={isFullscreen}
          onToggleFullscreen={toggleFullscreen}
        />
        <VideoFeedPlaceholder />
        <div className="absolute bottom-4 right-4">
          <span className="text-sm text-foreground/50">0 ft (RLT)</span>
        </div>
      </div>
    </div>
  );
};

export default GridCard;