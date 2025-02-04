'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';

const SearchPage: React.FC = () => {
    const searchParams = useSearchParams();
    const keywords = searchParams.get('keywords');
    const [results, setResults] = useState({ users: [], communities: [], posts: [] });

    useEffect(() => {
        if (keywords) {
            const fetchResults = async () => {
                const response = await fetch(`/api/search?keywords=${encodeURIComponent(keywords)}`);
                const data = await response.json();
                setResults(data);
            };
            fetchResults();
        }
    }, [keywords]);

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Search Results for "{keywords}"</h1>
            <div>
                <h2 className="text-xl font-semibold">Users</h2>
                {results.users.length > 0 ? (
                    results.users.map((user: any) => (
                        <Link key={user.id} href={`/profile/${user.id}`}>
                            <div className="p-2 border-b flex items-center cursor-pointer">
                                <img src={user.profile_image_url} alt={user.username} className="w-10 h-10 rounded-full mr-4" />
                                <span>{user.username}</span>
                            </div>
                        </Link>
                    ))
                ) : (
                    <p>No users found.</p>
                )}
            </div>
            <div>
                <h2 className="text-xl font-semibold">Communities</h2>
                {results.communities.length > 0 ? (
                    results.communities.map((community: any) => (
                        <div key={community.id} className="p-2 border-b">
                            <Link href={`/forum/${community.id}`}>
                                <h3 className="text-lg font-bold text-blue-500 hover:underline">{community.name}</h3>
                            </Link>
                            <p>{community.description}</p>
                            <div className="flex items-center mt-2 space-x-2">
                                {community.hashtags.map((tag: string) => (
                                    <span key={tag} className="bg-blue-100 text-blue-600 px-2 py-1 rounded text-sm">
                                        #{tag}
                                    </span>
                                ))}
                            </div>
                        </div>
                    ))
                ) : (
                    <p>No communities found.</p>
                )}
            </div>
            <div>
                <h2 className="text-xl font-semibold">Posts</h2>
                {results.posts.length > 0 ? (
                    results.posts.map((post: any) => (
                        <div key={post.id} className="bg-white shadow-md rounded-lg p-6 mb-4">
                            <div className="flex items-start">
                                <img
                                    src={post.author_profile_image_url}
                                    alt="Author profile"
                                    className="w-12 h-12 rounded-full mr-4"
                                />
                                <div className="flex flex-col">
                                    <h2 className="text-lg font-bold">{post.author_username}</h2>
                                    <p className="text-sm text-gray-500">
                                        {new Date(post.created_at).toLocaleString()}
                                    </p>
                                </div>
                            </div>
                            <div className="mt-4">
                                <h3 className="text-xl font-semibold">{post.title}</h3>
                                <p className="text-gray-700 mt-2">{post.content}</p>
                            </div>
                            {post.media_url && (
                                <div className="mt-4">
                                    {post.media_url.endsWith('.mp4') ? (
                                        <video controls className="w-full rounded-lg">
                                            <source src={post.media_url} type="video/mp4" />
                                        </video>
                                    ) : (
                                        <img
                                            src={post.media_url}
                                            alt="Post media"
                                            className="w-full rounded-lg"
                                        />
                                    )}
                                </div>
                            )}
                        </div>
                    ))
                ) : (
                    <p>No posts found.</p>
                )}
            </div>
        </div>
    );
};

export default SearchPage;