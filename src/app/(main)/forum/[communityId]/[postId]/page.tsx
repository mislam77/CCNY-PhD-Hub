'use client';

import React, { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { BiComment } from 'react-icons/bi';

interface Comment {
  id: string;
  author_id: string;
  post_id: string;
  content: string;
  created_at: string;
  author_username: string;
  author_profile_image_url: string;
}

const PostPage = ({ postId }: { postId: string }) => {
  const { user } = useUser();
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentContent, setCommentContent] = useState<string>('');
  const [showComments, setShowComments] = useState<boolean>(false);

  const fetchComments = async () => {
    const response = await fetch(`/api/comments?postId=${postId}`);
    if (response.ok) {
      setComments(await response.json());
    }
  };

  const handleAddComment = async () => {
    if (!commentContent.trim()) return;

    const response = await fetch('/api/comments', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        postId,
        content: commentContent,
      }),
    });

    if (response.ok) {
      const newComment = await response.json();
      setComments((prev) => [newComment, ...prev]);
      setCommentContent('');
    } else {
      console.error('Error adding comment');
    }
  };

  useEffect(() => {
    if (showComments) {
      fetchComments();
    }
  }, [showComments]);

  return (
    <div>
      <button onClick={() => setShowComments(!showComments)}>
        <BiComment className="text-lg" /> Comment
      </button>

      {showComments && (
        <div className="mt-4">
          {/* Comment input */}
          <div className="flex items-center mb-4">
            <img
              src={user?.profileImageUrl || '/placeholder.jpg'}
              alt="User profile"
              className="w-10 h-10 rounded-full mr-2"
            />
            <input
              type="text"
              value={commentContent}
              onChange={(e) => setCommentContent(e.target.value)}
              placeholder="Add a comment..."
              className="flex-1 border rounded-lg px-4 py-2"
            />
            <button
              onClick={handleAddComment}
              className="ml-2 bg-blue-500 text-white px-4 py-2 rounded-lg"
            >
              Post
            </button>
          </div>

          {/* Comments list */}
          <div className="space-y-4">
            {comments.map((comment) => (
              <div key={comment.id} className="flex items-start space-x-4">
                <img
                  src={comment.author_profile_image_url}
                  alt="Author profile"
                  className="w-10 h-10 rounded-full"
                />
                <div>
                  <p className="font-bold">{comment.author_username}</p>
                  <p className="text-sm text-gray-500">
                    {new Date(comment.created_at).toLocaleString()}
                  </p>
                  <p>{comment.content}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PostPage;