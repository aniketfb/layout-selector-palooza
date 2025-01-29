import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface GridCardProps {
  id: string;
  content: string;
  index: number;
}

const GridCard = ({ id, content, index }: GridCardProps) => {
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
      className="bg-white p-4 rounded-lg shadow cursor-move"
    >
      <span className="text-sm font-medium">{content}</span>
    </div>
  );
};

export default GridCard;