import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import LayoutSelector from "./LayoutSelector";
import SaveLayoutDialog from "./SaveLayoutDialog";

interface SavedLayout {
  name: string;
  items: Array<{ id: string; content: string }>;
}

interface GridControlsProps {
  currentLayout: "1-2" | "2-2" | "3-4";
  onLayoutChange: (layout: "1-2" | "2-2" | "3-4") => void;
  onSaveLayout: (name: string) => void;
  onLoadLayout: (name: string) => void;
  onDeleteLayout: (name: string, event: React.MouseEvent) => void;
  savedLayouts: SavedLayout[];
}

const GridControls = ({
  currentLayout,
  onLayoutChange,
  onSaveLayout,
  onLoadLayout,
  onDeleteLayout,
  savedLayouts,
}: GridControlsProps) => {
  return (
    <div className="flex items-center gap-4">
      <div className="h-10 flex items-center">
        <LayoutSelector
          currentLayout={currentLayout}
          onLayoutChange={onLayoutChange}
        />
      </div>
      <div className="h-10 flex items-center">
        <SaveLayoutDialog onSave={onSaveLayout} />
      </div>
      {savedLayouts.length > 0 && (
        <div className="h-10 flex items-center">
          <Select onValueChange={onLoadLayout}>
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
                    onClick={(e) => onDeleteLayout(layout.name, e)}
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
  );
};

export default GridControls;