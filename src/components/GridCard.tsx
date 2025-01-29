import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Video, Settings, Maximize2 } from "lucide-react";
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
import { useState, useEffect } from "react";
import AgoraRTC, { IAgoraRTCRemoteUser, ILocalVideoTrack } from "agora-rtc-sdk-ng";
import { useToast } from "@/components/ui/use-toast";

interface GridCardProps {
  id: string;
  content: string;
}

const GridCard = ({ id, content }: GridCardProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [channelName, setChannelName] = useState("");
  const [token, setToken] = useState("");
  const [appId, setAppId] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [localVideoTrack, setLocalVideoTrack] = useState<ILocalVideoTrack | null>(null);
  const [remoteUsers, setRemoteUsers] = useState<IAgoraRTCRemoteUser[]>([]);
  const { toast } = useToast();

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!appId || !channelName || !token) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    try {
      const agoraEngine = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });
      await agoraEngine.join(appId, channelName, token, null);
      const videoTrack = await AgoraRTC.createCameraVideoTrack();
      await agoraEngine.publish(videoTrack);
      setLocalVideoTrack(videoTrack);
      
      agoraEngine.on("user-published", async (user, mediaType) => {
        await agoraEngine.subscribe(user, mediaType);
        if (mediaType === "video") {
          setRemoteUsers((prevUsers) => [...prevUsers, user]);
        }
      });

      agoraEngine.on("user-unpublished", (user) => {
        setRemoteUsers((prevUsers) =>
          prevUsers.filter((u) => u.uid !== user.uid)
        );
      });

      setIsStreaming(true);
      setIsDialogOpen(false);
      
      toast({
        title: "Success",
        description: "Video stream started successfully",
      });
    } catch (error) {
      console.error("Error starting video stream:", error);
      toast({
        title: "Error",
        description: "Failed to start video stream. Please check your credentials.",
        variant: "destructive",
      });
    }
  };

  const handleFullscreenClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    const element = e.currentTarget.closest('.grid-card');
    if (!element) return;

    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      element.requestFullscreen();
    }
  };

  useEffect(() => {
    if (localVideoTrack && isStreaming) {
      const videoContainer = document.getElementById(`video-container-${id}`);
      if (videoContainer) {
        localVideoTrack.play(videoContainer);
      }
    }

    return () => {
      localVideoTrack?.stop();
    };
  }, [localVideoTrack, isStreaming, id]);

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="grid-card bg-card rounded-lg border border-border p-4 h-full min-h-[200px] transition-all duration-500 ease-in-out hover:border-primary/50 cursor-move relative flex flex-col"
    >
      <div className="absolute top-4 left-4 flex items-center gap-2">
        <div className={`w-2 h-2 rounded-full ${isStreaming ? 'bg-green-500' : 'bg-yellow-500'}`} />
        <span className="text-sm text-foreground/80">
          {isStreaming ? 'Streaming' : 'Not Connected'}
        </span>
      </div>
      
      <div className="absolute top-2 right-2 flex items-center gap-2">
        <div 
          className="p-2 cursor-pointer"
          onClick={handleFullscreenClick}
          onMouseDown={(e) => e.stopPropagation()}
        >
          <Button 
            variant="ghost" 
            size="icon"
            className="h-auto w-auto p-0 hover:bg-transparent"
          >
            <Maximize2 className="w-5 h-5 text-foreground/50 hover:text-foreground/80 transition-colors" />
          </Button>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <div 
              className="p-2 cursor-pointer"
              onClick={handleSettingsClick}
              onMouseDown={(e) => e.stopPropagation()}
            >
              <Button 
                variant="ghost" 
                size="icon"
                className="h-auto w-auto p-0 hover:bg-transparent"
              >
                <Settings className="w-5 h-5 text-foreground/50 hover:text-foreground/80 transition-colors" />
              </Button>
            </div>
          </DialogTrigger>
          <DialogContent onClick={(e) => e.stopPropagation()}>
            <DialogHeader>
              <DialogTitle>Video Feed Settings</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 py-4" onClick={(e) => e.stopPropagation()}>
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="channelName">Channel Name</Label>
                  <Input
                    id="channelName"
                    type="text"
                    value={channelName}
                    onChange={(e) => {
                      e.stopPropagation();
                      setChannelName(e.target.value);
                    }}
                    placeholder="Enter channel name"
                    onClick={(e) => e.stopPropagation()}
                    onMouseDown={(e) => e.stopPropagation()}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="token">Token</Label>
                  <Input
                    id="token"
                    type="text"
                    value={token}
                    onChange={(e) => {
                      e.stopPropagation();
                      setToken(e.target.value);
                    }}
                    placeholder="Enter token"
                    onClick={(e) => e.stopPropagation()}
                    onMouseDown={(e) => e.stopPropagation()}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="appId">App ID</Label>
                  <Input
                    id="appId"
                    type="text"
                    value={appId}
                    onChange={(e) => {
                      e.stopPropagation();
                      setAppId(e.target.value);
                    }}
                    placeholder="Enter App ID"
                    onClick={(e) => e.stopPropagation()}
                    onMouseDown={(e) => e.stopPropagation()}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">Start Stream</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center gap-4">
        {isStreaming ? (
          <div 
            id={`video-container-${id}`} 
            className="w-full h-full flex items-center justify-center"
          />
        ) : (
          <>
            <Video className="w-12 h-12 text-foreground/30" />
            <div className="text-center">
              <h3 className="text-lg font-medium text-foreground mb-2">No video feed available</h3>
              <p className="text-sm text-foreground/50">Click settings to configure video feed</p>
            </div>
          </>
        )}
      </div>

      <div className="absolute bottom-4 right-4">
        <span className="text-sm text-foreground/50">0 ft (RLT)</span>
      </div>
    </div>
  );
};

export default GridCard;