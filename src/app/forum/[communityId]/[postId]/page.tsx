// pages/post/[id].tsx
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { Button, Input, Textarea } from '@shadcn/ui';

const PostPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');

  useEffect(() => {
    if (id) {
      // Fetch post details
      fetch(`/api/posts/${id}`)
        .then((res) => res.json())
        .then((data) => setPost(data));

      // Fetch comments for this post
      fetch(`/api/comments?postId=${id}`)
        .then((res) => res.json())
        .then((data) => setComments(data));
    }
  }, [id]);

  const handleCommentSubmit = async () => {
    const response = await fetch('/api/comments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ postId: id, content: newComment }),
    });

    if (response.ok) {
      setNewComment('');
      // Refresh comments
      const updatedComments = await response.json();
      setComments(updatedComments);
    }
  };

  return (
    <div className="container mx-auto p-4">
      {post && (
        <>
          <h1 className="text-2xl font-bold">{post.title}</h1>
          <p>{post.content}</p>
          <div className="comments mt-4">
            <h2 className="text-xl">Comments</h2>
            <div>
              {comments.map((comment) => (
                <div key={comment.id} className="comment">
                  <p>{comment.content}</p>
                </div>
              ))}
            </div>
            <Textarea
              placeholder="Write a comment"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
            />
            <Button onClick={handleCommentSubmit}>Add Comment</Button>
          </div>
        </>
      )}
    </div>
  );
};

export default PostPage;