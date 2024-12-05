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
import { uploadToS3 } from '@/lib/aws';

interface Post {
  id: string;
  title: string;
  content: string;
  media_url?: string;
  created_at: string;
  updated_at: string;
  author_id: string;
  community_id: string;
}

interface CreatePostDialogProps {
  communityId: string;
  onCreatePost: (newPost: Post) => void;
}

const CreatePostDialog: React.FC<CreatePostDialogProps> = ({ communityId, onCreatePost }) => {
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
    let mediaUrl = '';
    if (media) {
      mediaUrl = await uploadToS3(media);
    }

    const postData = {
      communityId,
      title,
      content,
      mediaUrl,
    };

    const response = await fetch('/api/posts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(postData),
    });

    if (response.ok) {
      const newPost = await response.json();
      onCreatePost(newPost);
      setOpen(false);
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
            accept="image/*,video/*"
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