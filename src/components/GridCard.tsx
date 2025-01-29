import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Video, Settings } from "lucide-react";

interface GridCardProps {
  id: string;
  content: string;
}

const GridCard = ({ id, content }: GridCardProps) => {
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

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="bg-card rounded-lg border border-border p-4 h-full min-h-[200px] transition-all duration-500 ease-in-out hover:border-primary/50 cursor-move relative flex flex-col"
    >
      <div className="absolute top-4 left-4 flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-green-500" />
        <span className="text-sm text-foreground/80">Operational</span>
      </div>
      
      <div className="absolute top-4 right-4 flex items-center gap-2">
        <Settings className="w-5 h-5 text-foreground/50" />
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