import { useState } from "react";
import LayoutSelector from "./LayoutSelector";
import GridCard from "./GridCard";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

type LayoutOption = "1-2" | "2-2" | "3-4";

const GridLayout = () => {
  const [currentLayout, setCurrentLayout] = useState<LayoutOption>("2-2");
  const [currentPage, setCurrentPage] = useState(1);

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
    
    return Array.from(
      { length: itemsPerPage[currentLayout] },
      (_, i) => <GridCard key={startIndex + i} />
    );
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const startItem = ((currentPage - 1) * itemsPerPage[currentLayout]) + 1;
  const endItem = Math.min(currentPage * itemsPerPage[currentLayout], totalItems);

  return (
    <div className="flex flex-col items-center min-h-screen py-8">
      <div className="w-full max-w-7xl mx-auto px-4 flex justify-between items-center mb-8">
        <LayoutSelector
          currentLayout={currentLayout}
          onLayoutChange={(layout) => {
            setCurrentLayout(layout);
            setCurrentPage(1);
          }}
        />
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">
            Feeds {startItem} – {endItem} of {totalItems}
          </span>
          <PaginationPrevious
            onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)}
            className={currentPage <= 1 ? "pointer-events-none opacity-50" : ""}
          />
          <PaginationNext
            onClick={() => currentPage < totalPages && handlePageChange(currentPage + 1)}
            className={currentPage >= totalPages ? "pointer-events-none opacity-50" : ""}
          />
        </div>
      </div>
      <div className={`grid-layout layout-${currentLayout}`}>{getGridItems()}</div>
    </div>
  );
};

export default GridLayout;