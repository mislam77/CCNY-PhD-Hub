import { useState } from 'react';
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
import { useForm, Controller } from 'react-hook-form';
import { Popover, PopoverTrigger, PopoverContent } from '@radix-ui/react-popover';
import { uploadToS3 } from '@/lib/aws';

interface CreateCommunityDialogProps {
  onCommunityCreated: () => void;
}

const CreateCommunityDialog: React.FC<CreateCommunityDialogProps> = ({ onCommunityCreated }) => {
  const [open, setOpen] = useState(false);
  const { control, handleSubmit, watch } = useForm();
  const [bannerPhoto, setBannerPhoto] = useState<File | null>(null);
  const [bannerPhotoPreview, setBannerPhotoPreview] = useState<string | null>(null);

  const onSubmit = async (data: any) => {
    let bannerPhotoUrl = '';
    if (bannerPhoto) {
      bannerPhotoUrl = await uploadToS3(bannerPhoto);
    }

    const response = await fetch('/api/communities', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: data.name,
        description: data.description,
        hashtags: data.hashtags.split(',').map((tag: string) => tag.trim()),
        banner_photo_url: bannerPhotoUrl,
      }),
    });
    if (response.ok) {
      setOpen(false);
      onCommunityCreated(); // Call the function to fetch updated communities
    } else {
      console.error('Error creating community:', response.statusText);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button onClick={() => setOpen(true)}>Create Community</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create a New Community</DialogTitle>
          <DialogDescription>
            Provide the details for the new community.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          <Controller
            name="name"
            control={control}
            render={({ field }) => (
              <div>
                <label>Community Name</label>
                <Input placeholder="Community Name" {...field} />
              </div>
            )}
          />
          <Controller
            name="description"
            control={control}
            render={({ field }) => (
              <div>
                <label>Description</label>
                <Textarea placeholder="Description" {...field} />
              </div>
            )}
          />
          <Controller
            name="hashtags"
            control={control}
            render={({ field }) => (
              <div>
                <label>Hashtags (comma-separated)</label>
                <Input placeholder="Hashtags" {...field} />
              </div>
            )}
          />
          <Controller
            name="bannerPhoto"
            control={control}
            render={({ field }) => (
              <div>
                <label>Banner Photo</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="h-[100px] w-full">
                      {bannerPhotoPreview ? (
                        <div className="flex flex-col items-center gap-2 h-full w-full">
                          <img
                            src={bannerPhotoPreview}
                            alt="Banner Preview"
                            className="h-full w-full object-cover"
                          />
                          <p className="text-xs text-muted-foreground">
                            Click to change
                          </p>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center gap-2">
                          <span className="text-5xl" role="img">
                            📷
                          </span>
                          <p className="text-xs text-muted-foreground">
                            Click to select
                          </p>
                        </div>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-full">
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          const file = e.target.files[0];
                          setBannerPhoto(file);
                          field.onChange(file);

                          const reader = new FileReader();
                          reader.onloadend = () => {
                            setBannerPhotoPreview(reader.result as string);
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                  </PopoverContent>
                </Popover>
              </div>
            )}
          />
          <DialogFooter>
            <Button type="submit">Create</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateCommunityDialog;