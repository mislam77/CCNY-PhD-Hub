import { useState, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { uploadToS3 } from "@/lib/aws";

export default function CreateResearchGroupModal({ onClose, onGroupCreated }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [group_status, setGroup_Status] = useState("public");
  const [loading, setLoading] = useState(false);
  const [groupPhoto, setGroupPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null); // Ref for file input

  const handleSubmit = async () => {
    if (!title || !description) return;
  
    setLoading(true);
    try {
      let image_url = "";
      if (groupPhoto) {
        image_url = await uploadToS3(groupPhoto);
      }
  
      const response = await fetch("/api/research-groups", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description, group_status, image_url }),
      });
  
      if (response.ok) {
        const newGroup = await response.json();
        onGroupCreated(newGroup);
        onClose();
      } else {
        console.error("Failed to create research group");
      }
    } catch (error) {
      console.error("Error creating research group:", error);
    } finally {
      setLoading(false);
    }
  };
  

  const handleImageUpload = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setGroupPhoto(file);

      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFileClick = () => {
    fileInputRef.current?.click(); // Trigger the file input click programmatically
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Research Group</DialogTitle>
        </DialogHeader>

        <Input
          placeholder="Group Name"
          className="mb-4"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <Textarea
          placeholder="Group Description"
          className="mb-4"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <div className="mb-4 flex items-center justify-between">
          <Label>Group Status</Label>
          <div className="flex items-center gap-2">
            <span className="text-sm">{group_status === "public" ? "Public" : "Private"}</span>
            <Switch
              checked={group_status === "private"}
              onCheckedChange={() => setGroup_Status(group_status === "public" ? "private" : "public")}
            />
          </div>
        </div>

        <div className="mb-4">
          <Label>Group Photo</Label>
          <Button variant="outline" className="h-[100px] w-full" onClick={handleFileClick}>
            {photoPreview ? (
              <div className="flex flex-col items-center gap-2 h-full w-full">
                <img
                  src={photoPreview}
                  alt="Group Preview"
                  className="h-full w-full object-cover"
                />
                <p className="text-xs text-muted-foreground">Click to change</p>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2">
                <span className="text-5xl" role="img">
                  📷
                </span>
                <p className="text-xs text-muted-foreground">Click to select</p>
              </div>
            )}
          </Button>

          {/* Hidden file input */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImageUpload}
          />
        </div>

        <DialogFooter>
          <Button onClick={onClose} variant="outline" disabled={loading}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? "Creating..." : "Create"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}