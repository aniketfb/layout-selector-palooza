import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Settings } from "lucide-react";

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
      className="bg-card rounded-lg border border-border p-4 h-full min-h-[200px] transition-all duration-500 ease-in-out hover:border-primary/50 flex flex-col items-center justify-center cursor-move relative"
    >
      <Settings className="text-card-foreground/50 mb-4 w-12 h-12" />
      <div className="text-card-foreground/50 text-lg">
        {content}
      </div>
      <div className="text-card-foreground/30 text-sm mt-2">
        Click settings to configure
      </div>
    </div>
  );
};

export default GridCard;