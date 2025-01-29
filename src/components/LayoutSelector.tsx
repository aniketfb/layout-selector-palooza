import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type LayoutOption = "1-2" | "2-2" | "3-4";

interface LayoutSelectorProps {
  currentLayout: LayoutOption;
  onLayoutChange: (layout: LayoutOption) => void;
}

const LayoutSelector = ({ currentLayout, onLayoutChange }: LayoutSelectorProps) => {
  const layouts: { value: LayoutOption; label: string }[] = [
    { value: "1-2", label: "1×2" },
    { value: "2-2", label: "2×2" },
    { value: "3-4", label: "3×4" },
  ];

  return (
    <div className="mb-6">
      <Select value={currentLayout} onValueChange={onLayoutChange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select layout" />
        </SelectTrigger>
        <SelectContent>
          {layouts.map(({ value, label }) => (
            <SelectItem key={value} value={value}>
              {label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default LayoutSelector;