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
import { useState, useEffect } from "react";
import LayoutSelector from "./LayoutSelector";
import GridCard from "./GridCard";
import SaveLayoutDialog from "./SaveLayoutDialog";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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

  const handleDeleteLayout = (layoutName: string, event: React.MouseEvent) => {
    event.preventDefault(); // Prevent the select from opening
    event.stopPropagation(); // Stop the event from bubbling up
    setSavedLayouts((prev) => prev.filter((layout) => layout.name !== layoutName));
    toast({
      title: "Layout Deleted",
      description: `Layout "${layoutName}" has been deleted.`,
    });
  };

  const handleLayoutSelect = (layoutName: string) => {
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
          <div className="h-10 flex items-center">
            <LayoutSelector
              currentLayout={currentLayout}
              onLayoutChange={(layout) => {
                setCurrentLayout(layout);
                setCurrentPage(1);
              }}
            />
          </div>
          <div className="h-10 flex items-center">
            <SaveLayoutDialog onSave={handleSaveLayout} />
          </div>
          {savedLayouts.length > 0 && (
            <div className="h-10 flex items-center">
              <Select onValueChange={handleLayoutSelect}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Load Layout" />
                </SelectTrigger>
                <SelectContent>
                  {savedLayouts.map((layout) => (
                    <SelectItem 
                      key={layout.name} 
                      value={layout.name}
                      className="flex items-center justify-between group"
                    >
                      <span className="flex-grow">{layout.name}</span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 -mr-2"
                        onClick={(e) => handleDeleteLayout(layout.name, e)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">
            Feeds {startItem} – {endItem} of {totalItems}
          </span>
          <Button
            onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)}
            variant="outline"
            size="sm"
            className={currentPage <= 1 ? "pointer-events-none opacity-50" : ""}
          >
            Previous
          </Button>
          <Button
            onClick={() =>
              currentPage < totalPages && handlePageChange(currentPage + 1)
            }
            variant="outline"
            size="sm"
            className={currentPage >= totalPages ? "pointer-events-none opacity-50" : ""}
          >
            Next
          </Button>
        </div>
      </div>
      <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
        <div className={`grid-layout layout-${currentLayout}`}>
          <SortableContext
            items={getGridItems().map((item) => item.id)}
            strategy={rectSortingStrategy}
          >
            {getGridItems().map((item, index) => (
              <GridCard key={item.id} id={item.id} content={item.content} index={index} />
            ))}
          </SortableContext>
        </div>
      </DndContext>
    </div>
  );
};

export default GridLayout;
