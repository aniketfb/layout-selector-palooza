import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import AgoraRTC, { IAgoraRTC } from "agora-rtc-sdk-ng";
import { Settings2 } from "lucide-react";

type Props = {
  index: number;
  id?: string;
  content?: string;
};

const GridCard = ({ index, id, content }: Props) => {
  const [channelName, setChannelName] = useState("");
  const [token, setToken] = useState("");
  const [appId, setAppId] = useState("");
  const [isJoined, setIsJoined] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();
  const client = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });

  useEffect(() => {
    return () => {
      if (isJoined) {
        client.leave();
        setIsJoined(false);
      }
    };
  }, [client, isJoined]);

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
      setIsLoading(true);
      await client.join(appId, channelName, token, null);
      setIsJoined(true);
      toast({
        title: "Success",
        description: "Successfully joined the channel",
      });
      setIsOpen(false);
    } catch (error) {
      console.error("Error joining channel:", error);
      toast({
        title: "Error",
        description: "Failed to join channel",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full h-full flex items-center justify-center relative">
      {!isJoined ? (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <div className="absolute top-2 right-2">
              <Button
                variant="outline"
                size="icon"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsOpen(true);
                }}
              >
                <Settings2 className="h-4 w-4" />
              </Button>
            </div>
          </DialogTrigger>
          <DialogContent onClick={(e) => e.stopPropagation()}>
            <DialogHeader>
              <DialogTitle>Video Feed Settings</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4 py-4">
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
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "Joining..." : "Join Channel"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      ) : (
        <div className="w-full h-full bg-gray-200 flex items-center justify-center">
          <span>Video Feed {index + 1}</span>
        </div>
      )}
    </Card>
  );
};

export default GridCard;