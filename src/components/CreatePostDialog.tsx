// components/CreatePostDialog.tsx
import { useState, ChangeEvent } from 'react';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

interface CreatePostDialogProps {
  communityId: number;
}

const CreatePostDialog: React.FC<CreatePostDialogProps> = ({ communityId }) => {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [media, setMedia] = useState<File | null>(null);

  const handleMediaChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setMedia(e.target.files[0]);
    }
  };

  const handleSubmit = async () => {
    const postData = {
      communityId,
      title,
      content,
      mediaUrl: media ? media.name : null, // Handle media if present
    };
  
    console.log('Post Data:', postData); // Debug log
  
    const response = await fetch('/api/posts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(postData), // Convert postData to JSON
    });
  
    if (response.ok) {
      await response.json();
      setOpen(false); // Close the dialog on success
    } else {
      console.error('Error creating post:', response.statusText);
    }
  };    

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button onClick={() => setOpen(true)}>Create Post</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create a New Post</DialogTitle>
          <DialogDescription>Share your thoughts with the community.</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <Input
            placeholder="Post Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <Textarea
            placeholder="Content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
          <Input
            type="file"
            accept="image/*"
            onChange={handleMediaChange}
          />
        </div>
        <DialogFooter>
          <Button onClick={handleSubmit}>Submit</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreatePostDialog;