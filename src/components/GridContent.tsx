import {
  DndContext,
  DragEndEvent,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  rectSortingStrategy,
} from "@dnd-kit/sortable";
import GridCard from "./GridCard";

interface GridContentProps {
  items: Array<{ id: string; content: string }>;
  onDragEnd: (event: DragEndEvent) => void;
}

const GridContent = ({ items, onDragEnd }: GridContentProps) => {
  const mouseSensor = useSensor(MouseSensor);
  const touchSensor = useSensor(TouchSensor);
  const sensors = useSensors(mouseSensor, touchSensor);

  return (
    <DndContext sensors={sensors} onDragEnd={onDragEnd}>
      <SortableContext items={items.map((item) => item.id)} strategy={rectSortingStrategy}>
        {items.map((item, index) => (
          <GridCard key={item.id} id={item.id} content={item.content} index={index} />
        ))}
      </SortableContext>
    </DndContext>
  );
};

export default GridContent;