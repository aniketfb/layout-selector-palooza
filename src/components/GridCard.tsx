import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

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
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="bg-card rounded-lg border border-border p-4 h-full min-h-[200px] transition-all duration-300 hover:border-primary/50 flex items-center justify-center cursor-move"
    >
      <div className="text-card-foreground/50">
        {content}
      </div>
    </div>
  );
};

export default GridCard;