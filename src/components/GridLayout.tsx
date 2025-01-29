import { useState } from "react";
import LayoutSelector from "./LayoutSelector";
import GridCard from "./GridCard";

type LayoutOption = "1-2" | "2-2" | "3-4";

const GridLayout = () => {
  const [currentLayout, setCurrentLayout] = useState<LayoutOption>("2-2");

  const getGridItems = () => {
    const counts = {
      "1-2": 2,
      "2-2": 4,
      "3-4": 12,
    };

    return Array.from({ length: counts[currentLayout] }, (_, i) => (
      <GridCard key={i} />
    ));
  };

  return (
    <div className="flex flex-col items-center min-h-screen py-8">
      <LayoutSelector
        currentLayout={currentLayout}
        onLayoutChange={setCurrentLayout}
      />
      <div className={`grid-layout layout-${currentLayout}`}>{getGridItems()}</div>
    </div>
  );
};

export default GridLayout;