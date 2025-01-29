const GridCard = () => {
  return (
    <div className="bg-card rounded-lg border border-border p-4 h-full min-h-[200px] transition-all duration-300 hover:border-primary/50 flex items-center justify-center">
      <div className="text-card-foreground/50">
        Grid Item
      </div>
    </div>
  );
};

export default GridCard;