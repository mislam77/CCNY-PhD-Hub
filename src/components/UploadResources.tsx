"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface UploadResourcesProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onUploadComplete?: (resource: any) => void;
  groupId: string | string[];
}

export default function UploadResources({
  open,
  onOpenChange,
  onUploadComplete,
  groupId,
}: UploadResourcesProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!file) {
      alert("Please select a file to upload");
      return;
    }

    try {
      setIsUploading(true);
      
      // Step 1: Request a presigned URL from your API
      const urlResponse = await fetch(`/api/research/${groupId}/resources/presigned-url`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fileName: file.name,
          fileType: file.type,
        }),
      });
      
      if (!urlResponse.ok) {
        throw new Error("Failed to get upload URL");
      }
      
      const { url, key } = await urlResponse.json();
      
      // Step 2: Upload the file directly to S3 using the presigned URL
      const uploadResponse = await fetch(url, {
        method: "PUT",
        body: file,
        headers: {
          "Content-Type": file.type,
        },
      });
      
      if (!uploadResponse.ok) {
        throw new Error("Failed to upload file");
      }
      
      // Step 3: Save the resource metadata in your database
      const saveResponse = await fetch(`/api/research/${groupId}/resources`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description,
          fileKey: key,
          fileName: file.name,
          fileType: file.type,
          fileSize: file.size,
        }),
      });
      
      if (!saveResponse.ok) {
        throw new Error("Failed to save resource metadata");
      }
      
      const resource = await saveResponse.json();
      
      // Clear form and close dialog
      setTitle("");
      setDescription("");
      setFile(null);
      
      if (onUploadComplete) {
        onUploadComplete(resource);
      }
      
      if (onOpenChange) {
        onOpenChange(false);
      }
      
      alert("Your resource has been uploaded successfully");
    } catch (error) {
      console.error("Upload error:", error);
      alert(error instanceof Error ? error.message : "Could not upload resource");
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button size="sm">Add Resource</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[525px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Upload Resource</DialogTitle>
            <DialogDescription>
              Upload files such as papers, presentations, or other resources to share with the group.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="title" className="text-right">
                Title
              </Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                Description
              </Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="file" className="text-right">
                File
              </Label>
              <div className="col-span-3">
                <Input 
                  id="file" 
                  type="file" 
                  onChange={handleFileChange}
                  required 
                />
                {file && (
                  <p className="text-sm text-gray-500 mt-1">
                    Selected: {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
                  </p>
                )}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isUploading}>
              {isUploading ? "Uploading..." : "Upload Resource"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
