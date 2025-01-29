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
  PaginationEllipsis,
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

  const totalItems = 24;
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

  const getVisiblePages = () => {
    const pages = [];
    
    // Always show first page
    pages.push(1);
    
    if (currentPage > 3) {
      pages.push('ellipsis');
    }
    
    // Show current page and adjacent pages
    for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
      if (!pages.includes(i)) {
        pages.push(i);
      }
    }
    
    if (currentPage < totalPages - 2) {
      pages.push('ellipsis');
    }
    
    // Always show last page
    if (totalPages > 1) {
      pages.push(totalPages);
    }
    
    return pages;
  };

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
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)}
                className={currentPage <= 1 ? "pointer-events-none opacity-50" : ""}
              />
            </PaginationItem>
            {getVisiblePages().map((page, index) => (
              <PaginationItem key={index}>
                {page === 'ellipsis' ? (
                  <PaginationEllipsis />
                ) : (
                  <PaginationLink
                    onClick={() => handlePageChange(page as number)}
                    isActive={currentPage === page}
                  >
                    {page}
                  </PaginationLink>
                )}
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
      </div>
      <div className={`grid-layout layout-${currentLayout}`}>{getGridItems()}</div>
    </div>
  );
};

export default GridLayout;