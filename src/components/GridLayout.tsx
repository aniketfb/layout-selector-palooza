import { useState, useEffect } from "react";
import LayoutSelector from "./LayoutSelector";
import GridCard from "./GridCard";
import SaveLayoutDialog from "./SaveLayoutDialog";
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
  arrayMove,
  rectSortingStrategy,
} from "@dnd-kit/sortable";
import { useToast } from "@/components/ui/use-toast";

type LayoutOption = "1-2" | "2-2" | "3-4";

interface SavedLayout {
  name: string;
  items: Array<{ id: string; content: string }>;
}

const GridLayout = () => {
  const [currentLayout, setCurrentLayout] = useState<LayoutOption>("2-2");
  const [currentPage, setCurrentPage] = useState(1);
  const [items, setItems] = useState(() => 
    Array.from({ length: 19 }, (_, i) => ({ id: `${i + 1}`, content: `Item ${i + 1}` }))
  );
  const [savedLayouts, setSavedLayouts] = useState<SavedLayout[]>(() => {
    const saved = localStorage.getItem("savedLayouts");
    return saved ? JSON.parse(saved) : [];
  });

  const { toast } = useToast();
  const mouseSensor = useSensor(MouseSensor);
  const touchSensor = useSensor(TouchSensor);
  const sensors = useSensors(mouseSensor, touchSensor);

  useEffect(() => {
    localStorage.setItem("savedLayouts", JSON.stringify(savedLayouts));
  }, [savedLayouts]);

  const itemsPerPage = {
    "1-2": 2,
    "2-2": 4,
    "3-4": 12,
  };

  const totalItems = 19;
  const totalPages = Math.ceil(totalItems / itemsPerPage[currentLayout]);

  const getGridItems = () => {
    const startIndex = (currentPage - 1) * itemsPerPage[currentLayout];
    const endIndex = Math.min(startIndex + itemsPerPage[currentLayout], totalItems);
    const currentItems = items.slice(startIndex, endIndex);
    return currentItems;
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setItems((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const handleSaveLayout = (name: string) => {
    const newLayout: SavedLayout = {
      name,
      items: [...items],
    };
    setSavedLayouts((prev) => [...prev, newLayout]);
    toast({
      title: "Layout Saved",
      description: `Layout "${name}" has been saved successfully.`,
    });
  };

  const handleLoadLayout = (layoutName: string) => {
    const layout = savedLayouts.find((l) => l.name === layoutName);
    if (layout) {
      setItems(layout.items);
      toast({
        title: "Layout Loaded",
        description: `Layout "${layoutName}" has been loaded successfully.`,
      });
    }
  };

  const startItem = ((currentPage - 1) * itemsPerPage[currentLayout]) + 1;
  const endItem = Math.min(currentPage * itemsPerPage[currentLayout], totalItems);

  return (
    <div className="flex flex-col items-center min-h-screen py-8">
      <div className="w-full max-w-7xl mx-auto px-4 flex justify-between items-center mb-8">
        <div className="flex items-center gap-4">
          <LayoutSelector
            currentLayout={currentLayout}
            onLayoutChange={(layout) => {
              setCurrentLayout(layout);
              setCurrentPage(1);
            }}
          />
          <SaveLayoutDialog onSave={handleSaveLayout} />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">
            Feeds {startItem} – {endItem} of {totalItems}
          </span>
          <button
            onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)}
            className={`px-2 py-1 ${currentPage <= 1 ? "pointer-events-none opacity-50" : ""}`}
          >
            Previous
          </button>
          <button
            onClick={() => currentPage < totalPages && handlePageChange(currentPage + 1)}
            className={`px-2 py-1 ${currentPage >= totalPages ? "pointer-events-none opacity-50" : ""}`}
          >
            Next
          </button>
        </div>
      </div>
      {savedLayouts.length > 0 && (
        <div className="w-full max-w-7xl mx-auto px-4 mb-4 flex gap-2">
          {savedLayouts.map((layout) => (
            <Button
              key={layout.name}
              variant="outline"
              size="sm"
              onClick={() => handleLoadLayout(layout.name)}
            >
              {layout.name}
            </Button>
          ))}
        </div>
      )}
      <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
        <div className={`grid-layout layout-${currentLayout}`}>
          <SortableContext items={getGridItems().map(item => item.id)} strategy={rectSortingStrategy}>
            {getGridItems().map((item) => (
              <GridCard key={item.id} id={item.id} content={item.content} />
            ))}
          </SortableContext>
        </div>
      </DndContext>
    </div>
  );
};

export default GridLayout;