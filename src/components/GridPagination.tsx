import { Button } from "@/components/ui/button";

interface GridPaginationProps {
  currentPage: number;
  totalPages: number;
  startItem: number;
  endItem: number;
  totalItems: number;
  onPageChange: (page: number) => void;
}

const GridPagination = ({
  currentPage,
  totalPages,
  startItem,
  endItem,
  totalItems,
  onPageChange,
}: GridPaginationProps) => {
  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-muted-foreground">
        Feeds {startItem} – {endItem} of {totalItems}
      </span>
      <Button
        onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
        variant="outline"
        size="sm"
        className={currentPage <= 1 ? "pointer-events-none opacity-50" : ""}
      >
        Previous
      </Button>
      <Button
        onClick={() =>
          currentPage < totalPages && onPageChange(currentPage + 1)
        }
        variant="outline"
        size="sm"
        className={currentPage >= totalPages ? "pointer-events-none opacity-50" : ""}
      >
        Next
      </Button>
    </div>
  );
};

export default GridPagination;