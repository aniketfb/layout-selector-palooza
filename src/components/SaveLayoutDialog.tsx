import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";

interface SaveLayoutDialogProps {
  onSave: (name: string) => void;
}

const SaveLayoutDialog = ({ onSave }: SaveLayoutDialogProps) => {
  const [layoutName, setLayoutName] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const handleSave = () => {
    if (layoutName.trim()) {
      onSave(layoutName.trim());
      setLayoutName("");
      setIsOpen(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Save Current Layout</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Save Layout</DialogTitle>
          <DialogDescription>
            Give your current layout arrangement a name to save it for later use.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Input
            placeholder="Layout name"
            value={layoutName}
            onChange={(e) => setLayoutName(e.target.value)}
          />
        </div>
        <DialogFooter>
          <Button onClick={handleSave}>Save Layout</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SaveLayoutDialog;