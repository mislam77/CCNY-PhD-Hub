'use client';

import React, { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import Image from 'next/image';
import { FaHeart, FaCommentAlt, FaEdit } from 'react-icons/fa';
import { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface Content {
  text: string;
  imageUrl?: string; // For image stored in S3
}

interface Post {
  id: string;
  author_id: string;
  title: string;
  content: Content;
  image_url: string | null;
  likes: number;
  comments_count: number;
  created_at: string;
  author_username: string;
  author_firstname: string;
  author_lastname: string;
  author_profile_image: string;
}

const CreatePostForm: React.FC<{ onCreatePost: (formData: FormData) => void }> = ({ onCreatePost }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [image, setImage] = useState<File | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title', title);
    formData.append('content', content);
    if (image) {
      formData.append('image', image);
    }
    onCreatePost(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-gray-700">Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded"
        />
      </div>
      <div>
        <label className="block text-gray-700">Content</label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded"
        />
      </div>
      <div>
        <label className="block text-gray-700">Image</label>
        <input
          type="file"
          onChange={(e) => setImage(e.target.files ? e.target.files[0] : null)}
          className="w-full p-2 border border-gray-300 rounded"
        />
      </div>
      <Button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
        Create Post
      </Button>
    </form>
  );
};

const ForumPage: React.FC = () => {
  const { isSignedIn, user } = useUser();
  const [posts, setPosts] = useState<Post[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const fetchPosts = async () => {
    try {
      const response = await fetch('/api/posts');
      if (response.ok) {
        const data: Post[] = await response.json();
        setPosts(data);
      } else {
        console.error('Error fetching posts:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleCreatePost = async (formData: FormData) => {
    if (!isSignedIn || !user) return;

    formData.append('authorId', user.id); // Ensure authorId is included

    try {
      const response = await fetch('/api/posts', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const newPost: Post = await response.json();
        setPosts([newPost, ...posts]);
        setIsDialogOpen(false); // Close the dialog after creating the post
      } else {
        console.error('Error creating post:', response.statusText);
      }
    } catch (error) {
      console.error('Error creating post:', error);
    }
  };

  return (
    <div className="container mx-auto">
      <div className="relative h-64 bg-cover bg-center mb-8" style={{ backgroundImage: 'url(https://i.imgur.com/nqgZREZ.jpeg)' }}>
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-white">
          <h1 className="text-4xl font-bold">Community Board</h1>
          <p className="text-lg mt-2">A place for CCNY PhD students to connect and share.</p>
        </div>
      </div>
      <div className="flex justify-center space-x-4 mb-8">
        <Button className="bg-green-500 text-white px-4 py-2 rounded">Create Community</Button>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-500 text-white px-4 py-2 rounded">Create Post</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogTitle>Create a New Post</DialogTitle>
            <DialogDescription>Share your thoughts and updates with the community.</DialogDescription>
            <CreatePostForm onCreatePost={handleCreatePost} />
          </DialogContent>
        </Dialog>
      </div>
      <div className="space-y-4 mx-40">
        {posts.map((post) => (
          <div key={post.id} className="bg-white shadow-md rounded-lg p-4 relative">
            <div className="absolute top-2 right-2">
              <FaEdit className="text-gray-500 cursor-pointer" />
            </div>
            <div className="flex items-center mb-4">
              <Image
                src={user?.imageUrl || 'https://via.placeholder.com/50'}
                alt="Profile Picture"
                width={50}
                height={50}
                className="rounded-full"
              />
              <div className="ml-4">
                <h2 className="text-lg font-bold">{post.author_firstname} {post.author_lastname}</h2>
                <p className="text-sm text-gray-500">@{post.author_username}</p>
              </div>
            </div>
            <h3 className="text-xl font-bold mb-2">{post.title}</h3>
            <p className="mb-4">{post.content.text}</p>
            {post.image_url && (
              <Image
                src={post.image_url}
                alt="Post Image"
                width={500}
                height={300}
                className="mb-4"
              />
            )}
            <div className="flex items-center mt-4">
              <FaHeart className="mr-2 text-red-500" /> {post.likes}
              <FaCommentAlt className="ml-4 mr-2 text-blue-500" /> {post.comments_count}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ForumPage;