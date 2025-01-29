import { useState, useEffect } from "react";
import { DragEndEvent } from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import { useToast } from "@/components/ui/use-toast";
import GridControls from "./GridControls";
import GridPagination from "./GridPagination";
import GridContent from "./GridContent";

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
  const startItem = ((currentPage - 1) * itemsPerPage[currentLayout]) + 1;
  const endItem = Math.min(currentPage * itemsPerPage[currentLayout], totalItems);

  const getGridItems = () => {
    const startIndex = (currentPage - 1) * itemsPerPage[currentLayout];
    const endIndex = Math.min(startIndex + itemsPerPage[currentLayout], totalItems);
    return items.slice(startIndex, endIndex);
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
    event.preventDefault();
    event.stopPropagation();
    setSavedLayouts((prev) => prev.filter((layout) => layout.name !== layoutName));
    toast({
      title: "Layout Deleted",
      description: `Layout "${layoutName}" has been deleted.`,
    });
  };

  return (
    <div className="flex flex-col items-center min-h-screen py-8">
      <div className="w-full max-w-7xl mx-auto px-4 flex justify-between items-center mb-8">
        <GridControls
          currentLayout={currentLayout}
          onLayoutChange={(layout) => {
            setCurrentLayout(layout);
            setCurrentPage(1);
          }}
          onSaveLayout={handleSaveLayout}
          onLoadLayout={handleLoadLayout}
          onDeleteLayout={handleDeleteLayout}
          savedLayouts={savedLayouts}
        />
        <GridPagination
          currentPage={currentPage}
          totalPages={totalPages}
          startItem={startItem}
          endItem={endItem}
          totalItems={totalItems}
          onPageChange={handlePageChange}
        />
      </div>
      <div className={`grid-layout layout-${currentLayout}`}>
        <GridContent items={getGridItems()} onDragEnd={handleDragEnd} />
      </div>
    </div>
  );
};

export default GridLayout;