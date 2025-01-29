import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Video, Settings } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";

interface GridCardProps {
  id: string;
  content: string;
}

const GridCard = ({ id, content }: GridCardProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [channelName, setChannelName] = useState("");
  const [token, setToken] = useState("");
  const [appId, setAppId] = useState("");
  
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition: transition || 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
  };

  const handleSettingsClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({ channelName, token, appId });
    setIsDialogOpen(false);
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="bg-card rounded-lg border border-border p-4 h-full min-h-[200px] transition-all duration-500 ease-in-out hover:border-primary/50 cursor-move relative flex flex-col"
    >
      <div className="absolute top-4 left-4 flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-green-500" />
        <span className="text-sm text-foreground/80">Operational</span>
      </div>
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <div 
          className="absolute top-2 right-2 p-2 cursor-pointer"
          onClick={handleSettingsClick}
          onMouseDown={(e) => e.stopPropagation()}
          onPointerDown={(e) => e.stopPropagation()}
          onTouchStart={(e) => e.stopPropagation()}
        >
          <DialogTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon"
              className="h-auto w-auto p-0 hover:bg-transparent"
            >
              <Settings className="w-5 h-5 text-foreground/50 hover:text-foreground/80 transition-colors" />
            </Button>
          </DialogTrigger>
        </div>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Video Feed Settings</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 py-4">
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="channelName">Channel Name</Label>
                <Input
                  id="channelName"
                  value={channelName}
                  onChange={(e) => setChannelName(e.target.value)}
                  placeholder="Enter channel name"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="token">Token</Label>
                <Input
                  id="token"
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
                  placeholder="Enter token"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="appId">App ID</Label>
                <Input
                  id="appId"
                  value={appId}
                  onChange={(e) => setAppId(e.target.value)}
                  placeholder="Enter App ID"
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">Save Changes</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <div className="flex-1 flex flex-col items-center justify-center gap-4">
        <Video className="w-12 h-12 text-foreground/30" />
        <div className="text-center">
          <h3 className="text-lg font-medium text-foreground mb-2">No video feed available</h3>
          <p className="text-sm text-foreground/50">Click settings to configure video feed</p>
        </div>
      </div>

      <div className="absolute bottom-4 right-4">
        <span className="text-sm text-foreground/50">0 ft (RLT)</span>
      </div>
    </div>
  );
};

export default GridCard;