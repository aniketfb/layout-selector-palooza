import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

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
    <div className="flex gap-2 mb-6">
      {layouts.map(({ value, label }) => (
        <Button
          key={value}
          onClick={() => onLayoutChange(value)}
          variant={currentLayout === value ? "default" : "outline"}
          className={cn(
            "min-w-[80px]",
            currentLayout === value && "bg-primary text-primary-foreground"
          )}
        >
          {label}
        </Button>
      ))}
    </div>
  );
};

export default LayoutSelector;