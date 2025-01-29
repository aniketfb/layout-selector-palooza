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

  const totalItems = 24; // Example total number of items
  const totalPages = Math.ceil(totalItems / itemsPerPage[currentLayout]);

  const getGridItems = () => {
    const startIndex = (currentPage - 1) * itemsPerPage[currentLayout];
    const endIndex = startIndex + itemsPerPage[currentLayout];
    
    return Array.from(
      { length: itemsPerPage[currentLayout] },
      (_, i) => <GridCard key={startIndex + i} />
    );
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="flex flex-col items-center min-h-screen py-8">
      <div className="w-full max-w-7xl mx-auto px-4 flex justify-between items-center mb-8">
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)}
                className={currentPage <= 1 ? "pointer-events-none opacity-50" : ""}
              />
            </PaginationItem>
            {Array.from({ length: totalPages }, (_, i) => (
              <PaginationItem key={i + 1}>
                <PaginationLink
                  onClick={() => handlePageChange(i + 1)}
                  isActive={currentPage === i + 1}
                >
                  {i + 1}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext
                onClick={() =>
                  currentPage < totalPages && handlePageChange(currentPage + 1)
                }
                className={
                  currentPage >= totalPages ? "pointer-events-none opacity-50" : ""
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
        <LayoutSelector
          currentLayout={currentLayout}
          onLayoutChange={(layout) => {
            setCurrentLayout(layout);
            setCurrentPage(1); // Reset to first page when layout changes
          }}
        />
      </div>
      <div className={`grid-layout layout-${currentLayout}`}>{getGridItems()}</div>
    </div>
  );
};

export default GridLayout;