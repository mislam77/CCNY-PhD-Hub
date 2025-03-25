import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from '@/components/ui/dialog';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

interface CreateDiscussionDialogProps {
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
    onSubmit?: (title: string, content: string) => void;
    groupId: string;
}

const CreateDiscussionDialog = ({ 
    open, 
    onOpenChange, 
    onSubmit,
    groupId 
}: CreateDiscussionDialogProps) => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!title.trim() || !content.trim()) {
            return;
        }

        setIsSubmitting(true);
        try {
            if (onSubmit) {
                await onSubmit(title, content);
            }
            // Reset form
            setTitle('');
            setContent('');
        } catch (error) {
            console.error("Failed to create discussion:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogTrigger asChild>
                <Button size="sm">New Discussion</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[550px]">
                <DialogHeader>
                    <DialogTitle>
                        New Discussion
                    </DialogTitle>
                    <DialogDescription>
                        Start a new topic for group members to discuss.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="title">Title</Label>
                            <Input
                                id="title"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="Enter discussion title"
                                required
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="content">Content</Label>
                            <Textarea
                                id="content"
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                placeholder="What would you like to discuss?"
                                rows={5}
                                required
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button 
                            type="button" 
                            variant="outline" 
                            onClick={() => onOpenChange && onOpenChange(false)}
                        >
                            Cancel
                        </Button>
                        <Button 
                            type="submit" 
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? "Creating..." : "Create Discussion"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default CreateDiscussionDialog;