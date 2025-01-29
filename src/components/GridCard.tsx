import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Video, Settings, Maximize2, Minimize2 } from "lucide-react";
import { useState, useRef, useEffect } from "react";

interface GridCardProps {
  id: string;
  content: string;
}

const GridCard = ({ id, content }: GridCardProps) => {
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
    const handleFullscreenChange = () => {
      setIsFullscreen(document.fullscreenElement === cardRef.current);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
    };
  }, []);

  const toggleFullscreen = async () => {
    try {
      if (!isFullscreen && cardRef.current) {
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
      ref={(node) => {
        setNodeRef(node);
        if (cardRef) cardRef.current = node;
      }}
      style={isFullscreen ? undefined : style}
      {...(isFullscreen ? {} : { ...attributes, ...listeners })}
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
      <div className="absolute top-4 left-4 flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-green-500" />
        <span className="text-sm text-foreground/80">Operational</span>
      </div>
      
      <div className="absolute top-4 right-4 flex items-center gap-2">
        {isFullscreen ? (
          <Minimize2 
            className="w-5 h-5 text-foreground/50 hover:text-foreground/80 cursor-pointer" 
            onClick={toggleFullscreen}
          />
        ) : (
          <Maximize2 
            className="w-5 h-5 text-foreground/50 hover:text-foreground/80 cursor-pointer" 
            onClick={toggleFullscreen}
          />
        )}
        <Settings className="w-5 h-5 text-foreground/50 hover:text-foreground/80 cursor-pointer" />
      </div>

      <div className="flex-1 flex flex-col items-center justify-center gap-4">
        <Video className="w-12 h-12 text-foreground/30" />
        <div className="text-center">
          <h3 className="text-lg font-medium text-foreground mb-2">No video feed available</h3>
          <p className="text-sm text-foreground/50">Click settings to configure video feed</p>
        </div>
      </div>

      <div className="absolute bottom-4 right-4">
        <span className="text-sm text-foreground/50">0 ft (RLT)</span>
      </div>
    </div>
  );
};

export default GridCard;