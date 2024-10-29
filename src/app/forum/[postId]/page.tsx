'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useUser } from '@clerk/nextjs';
import { useParams } from 'next/navigation';

type Comment = {
  id: string;
  text: string;
  author_username: string;
};

type Post = {
  title: string;
  author_username: string;
  content: {
    text: string;
  };
};

const PostPage: React.FC = () => {
  const { isSignedIn, user } = useUser();
  const { postId } = useParams();
  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);

  const fetchPost = useCallback(async () => {
    try {
      const response = await fetch(`/api/posts/${postId}`);
      if (response.ok) {
        const data = await response.json();
        setPost(data);
      } else {
        console.error('Error fetching post:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching post:', error);
    }
  }, [postId]); // Add postId as a dependency

  const fetchComments = useCallback(async () => {
    try {
      const response = await fetch(`/api/comments?postId=${postId}`);
      if (response.ok) {
        const data = await response.json();
        setComments(data);
      } else {
        console.error('Error fetching comments:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  }, [postId]);

  useEffect(() => {
    if (postId) {
      fetchPost();
      fetchComments();
    }
  }, [postId, fetchPost, fetchComments]);

  const handleCreateComment = async (text: string, replyToId: string | null = null) => {
    if (!isSignedIn || !user) return;

    try {
      const response = await fetch('/api/comments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text, authorId: user.id, postId, replyToId }),
      });

      if (response.ok) {
        const newComment = await response.json();
        setComments([...comments, newComment]);
      } else {
        console.error('Error creating comment:', response.statusText);
      }
    } catch (error) {
      console.error('Error creating comment:', error);
    }
  };

  if (!post) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">{post.title}</h1>
      <p>By {post.author_username}</p>
      <p>{post.content.text}</p>
      <h2 className="text-2xl font-bold mt-6 mb-4">Comments</h2>
      {isSignedIn && (
        <CreateCommentForm onCreateComment={handleCreateComment} />
      )}
      <div className="space-y-4">
        {comments.map((comment) => (
          <div key={comment.id} className="bg-white shadow-md rounded-lg p-4">
            <p>{comment.text}</p>
            <p>By {comment.author_username}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

const CreateCommentForm: React.FC<{ onCreateComment: (text: string, replyToId?: string | null) => void }> = ({ onCreateComment }) => {
  const [text, setText] = useState('');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onCreateComment(text);
    setText('');
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4">
      <div className="mb-2">
        <label className="block text-gray-700">Comment</label>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded"
        />
      </div>
      <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
        Add Comment
      </button>
    </form>
  );
};

export default PostPage;