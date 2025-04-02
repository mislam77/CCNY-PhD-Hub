"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useUser } from "@clerk/nextjs";
import { format, formatDistanceToNow } from "date-fns";
import CreateDiscussionDialog from "@/components/CreateDiscussionDialog";
import UploadResources from "@/components/UploadResources";
import { Textarea } from "@/components/ui/textarea";

export default function ResearchGroupPage() {
  const { id } = useParams();
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const [group, setGroup] = useState(null);
  const [activities, setActivities] = useState([]);
  const [discussions, setDiscussions] = useState([]);
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activityLoading, setActivityLoading] = useState(true);
  const [discussionsLoading, setDiscussionsLoading] = useState(true);
  const [resourcesLoading, setResourcesLoading] = useState(true);
  const [error, setError] = useState(null);
  const [membershipStatus, setMembershipStatus] = useState("loading"); // "member", "nonmember", "admin", "loading"
  const [membershipLoading, setMembershipLoading] = useState(false);
  const [isDiscussionDialogOpen, setIsDiscussionDialogOpen] = useState(false);
  const [isResourceDialogOpen, setIsResourceDialogOpen] = useState(false);
  const [expandedDiscussions, setExpandedDiscussions] = useState({});
  const [discussionComments, setDiscussionComments] = useState({});
  const [commentText, setCommentText] = useState({});
  const [submittingComment, setSubmittingComment] = useState(false);
  const [expandedDiscussionContent, setExpandedDiscussionContent] = useState({});
  const [downloadingResource, setDownloadingResource] = useState<string | null>(null);

  // Fetch group details
  useEffect(() => {
    const fetchGroupDetails = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/research/${id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch research group");
        }
        const data = await response.json();
        setGroup(data);

        // Determine membership status
        if (isLoaded && user) {
          if (data.admins.includes(user.id)) {
            setMembershipStatus("admin");
          } else if (data.members.includes(user.id)) {
            setMembershipStatus("member");
          } else {
            setMembershipStatus("nonmember");
          }
        }
      } catch (err) {
        setError(err.message);
        console.error("Error fetching research group:", err);
      } finally {
        setLoading(false);
      }
    };

    if (id && isLoaded) {
      fetchGroupDetails();
    }
  }, [id, user, isLoaded]);

  // Fetch activities
  useEffect(() => {
    const fetchActivities = async () => {
      try {
        setActivityLoading(true);
        const response = await fetch(`/api/research/${id}/activity`);
        if (!response.ok) {
          throw new Error("Failed to fetch activities");
        }
        const data = await response.json();
        setActivities(data);
      } catch (err) {
        console.error("Error fetching activities:", err);
      } finally {
        setActivityLoading(false);
      }
    };

    if (id) {
      fetchActivities();
    }
  }, [id]);

  // Fetch discussions
  useEffect(() => {
    const fetchDiscussions = async () => {
      try {
        setDiscussionsLoading(true);
        const response = await fetch(`/api/research/${id}/discussions`);
        if (!response.ok) {
          throw new Error("Failed to fetch discussions");
        }
        const data = await response.json();
        setDiscussions(data.rows || []);
      } catch (err) {
        console.error("Error fetching discussions:", err);
      } finally {
        setDiscussionsLoading(false);
      }
    };

    if (id) {
      fetchDiscussions();
    }
  }, [id]);

  // Fetch resources
  useEffect(() => {
    const fetchResources = async () => {
      try {
        setResourcesLoading(true);
        const response = await fetch(`/api/research/${id}/resources`);
        if (!response.ok) {
          throw new Error("Failed to fetch resources");
        }
        const data = await response.json();
        setResources(data.resources || []);
      } catch (err) {
        console.error("Error fetching resources:", err);
      } finally {
        setResourcesLoading(false);
      }
    };

    if (id) {
      fetchResources();
    }
  }, [id]);

  // Handle join group
  const handleJoinGroup = async () => {
    if (!user) {
      // Redirect to sign in
      router.push("/sign-in");
      return;
    }

    setMembershipLoading(true);
    try {
      const response = await fetch(`/api/research/${id}/membership`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to join group");
      }

      // Update membership status and group data
      setMembershipStatus("member");
      setGroup((prev) => ({
        ...prev,
        members: [...prev.members, user.id],
        memberCount: prev.memberCount + 1,
      }));

      // Refresh activities
      const activitiesResponse = await fetch(`/api/research/${id}/activity`);
      const activitiesData = await activitiesResponse.json();
      setActivities(activitiesData);
    } catch (err) {
      console.error("Error joining group:", err);
      alert(err.message);
    } finally {
      setMembershipLoading(false);
    }
  };

  // Handle leave group
  const handleLeaveGroup = async () => {
    if (window.confirm("Are you sure you want to leave this group?")) {
      setMembershipLoading(true);
      try {
        const response = await fetch(`/api/research/${id}/membership`, {
          method: "DELETE",
        });

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.error || "Failed to leave group");
        }

        // Update membership status and group data
        setMembershipStatus("nonmember");
        setGroup((prev) => ({
          ...prev,
          members: prev.members.filter((memberId) => memberId !== user.id),
          admins: prev.admins.filter((adminId) => adminId !== user.id),
          memberCount: prev.memberCount - 1,
        }));

        // Refresh activities
        const activitiesResponse = await fetch(`/api/research/${id}/activity`);
        const activitiesData = await activitiesResponse.json();
        setActivities(activitiesData);
      } catch (err) {
        console.error("Error leaving group:", err);
        alert(err.message);
      } finally {
        setMembershipLoading(false);
      }
    }
  };

  // Handle discussion creation
  const handleCreateDiscussion = async (title, content) => {
    try {
      const response = await fetch(`/api/research/${id}/discussions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, content, id }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to create discussion");
      }

      // Close the dialog and refresh discussions
      setIsDiscussionDialogOpen(false);

      // Fetch updated discussions
      const discussionsResponse = await fetch(`/api/research/${id}/discussions`);
      const discussionsData = await discussionsResponse.json();
      setDiscussions(discussionsData.rows || []);
    } catch (err) {
      console.error("Error creating discussion:", err);
      alert(err.message);
    }
  };

  // Handle resource upload complete
  const handleResourceUpload = (newResource) => {
    setResources((prev) => [newResource, ...prev]);
  };

  // Add a helper function to get the user's name from their ID
  const getUserNameById = (userId) => {
    // Check admin list
    const admin = group?.adminInfo?.find((admin) => admin.id === userId);
    if (admin) return admin.name;

    // Check member list
    const member = group?.memberInfo?.find((member) => member.id === userId);
    if (member) return member.name;

    // Return a fallback if user not found
    return "Unknown User";
  };

  // add a function to get the user's image from their ID
  const getUserImageById = (userId) => {
    // Check admin list
    const admin = group?.adminInfo?.find((admin) => admin.id === userId);
    if (admin) return admin.imageUrl;

    // Check member list
    const member = group?.memberInfo?.find((member) => member.id === userId);
    if (member) return member.imageUrl;

    // Return a fallback if user not found
    return null;
  };

  // Add a function to format file size
  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + " B";
    else if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    else if (bytes < 1024 * 1024 * 1024) return (bytes / (1024 * 1024)).toFixed(1) + " MB";
    else return (bytes / (1024 * 1024 * 1024)).toFixed(1) + " GB";
  };

  // Add a function to handle resource download
  const handleResourceDownload = async (resourceId: string, fileKey: string) => {
    try {
      setDownloadingResource(resourceId);
      
      // Request a presigned URL for downloading
      const response = await fetch(`/api/research/${id}/resources/download`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fileKey }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to generate download link');
      }
      
      const { url } = await response.json();
      
      // Open the download link in a new tab
      window.open(url, '_blank');
    } catch (error) {
      console.error('Error downloading resource:', error);
      alert('Could not download the resource. Please try again later.');
    } finally {
      setDownloadingResource(null);
    }
  };

  // Toggle discussion comments visibility
  const toggleDiscussionComments = async (discussionId) => {
    // If comments are already expanded, just toggle visibility
    if (expandedDiscussions[discussionId]) {
      setExpandedDiscussions((prev) => ({
        ...prev,
        [discussionId]: !prev[discussionId],
      }));
      return;
    }

    // If expanding for the first time, fetch comments
    try {
      const response = await fetch(`/api/research/${id}/discussions/${discussionId}/comments`);
      if (!response.ok) {
        throw new Error("Failed to fetch comments");
      }
      const data = await response.json();

      // Store fetched comments
      setDiscussionComments((prev) => ({
        ...prev,
        [discussionId]: data.comments || [],
      }));

      // Expand the discussion
      setExpandedDiscussions((prev) => ({
        ...prev,
        [discussionId]: true,
      }));
    } catch (err) {
      console.error("Error fetching comments:", err);
      alert("Failed to load comments");
    }
  };

  // Handle comment submission
  const handleCommentSubmit = async (discussionId) => {
    if (!commentText[discussionId] || commentText[discussionId].trim() === '') {
      return; // Don't submit empty comments
    }

    setSubmittingComment(true);
    try {
      const response = await fetch(`/api/research/${id}/discussions/${discussionId}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: commentText[discussionId] }),
      });

      if (!response.ok) {
        throw new Error('Failed to post comment');
      }

      const data = await response.json();

      // Add the new comment to the list
      setDiscussionComments((prev) => ({
        ...prev,
        [discussionId]: [...(prev[discussionId] || []), data.comment],
      }));

      // Clear the comment text
      setCommentText((prev) => ({
        ...prev,
        [discussionId]: '',
      }));
    } catch (err) {
      console.error('Error posting comment:', err);
      alert('Failed to post comment');
    } finally {
      setSubmittingComment(false);
    }
  };

  // Toggle discussion content expansion
  const toggleDiscussionContent = (discussionId) => {
    setExpandedDiscussionContent((prev) => ({
      ...prev,
      [discussionId]: !prev[discussionId],
    }));
  };

  // Helper to check if content is long enough to need truncation
  const isContentLong = (content) => {
    return content.length > 300;
  };

  // Helper to get truncated content
  const getTruncatedContent = (content) => {
    return content.length > 300 ? content.substring(0, 300) + "..." : content;
  };

  // Render activity item
  const renderActivityItem = (activity) => {
    const { activityType, user, createdAt } = activity;

    let actionText = "";
    switch (activityType) {
      case "join_group":
        actionText = "joined the group";
        break;
      case "leave_group":
        actionText = "left the group";
        break;
      // Add more activity types as needed
      case "create_discussion":
        actionText = "created a discussion";
        break;
      case "add_discussion_comment":
        actionText = "commented on a discussion";
        break;
      case "create_resource":
        actionText = "uploaded a resource";
        break;
      default:
        actionText = "performed an action";
    }

    return (
      <div key={activity.id} className="flex items-start space-x-3 py-3 border-b">
        <Avatar>
          <AvatarImage src={user.imageUrl} alt={user.name} />
          <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <div className="flex items-center">
            <span className="font-medium">{user.name}</span>
            <span className="text-gray-500 text-sm ml-2">{actionText}</span>
          </div>
          <p className="text-xs text-gray-500">
            {formatDistanceToNow(new Date(createdAt), { addSuffix: true })}
          </p>
        </div>
      </div>
    );
  };

  if (loading) return <div className="container mx-auto p-6">Loading...</div>;
  if (error) return <div className="container mx-auto p-6">Error: {error}</div>;
  if (!group) return <div className="container mx-auto p-6">Group not found</div>;

  return (
    <div className="flex flex-col">
      {/* Banner Photo */}
      <div className="relative w-full h-48 md:h-64">
        <Image
          src={group.image_url}
          alt={group.title}
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/50"></div>
      </div>

      <div className="container mx-auto p-6">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Group Header */}
          <div className="w-full md:w-2/3">
            <div className="mb-6">
              <div className="flex justify-between items-start mb-2">
                <h1 className="text-3xl font-bold">{group.title}</h1>
                {membershipStatus === "nonmember" && (
                  <Button onClick={handleJoinGroup} disabled={membershipLoading}>
                    {membershipLoading ? "Joining..." : "Join Group"}
                  </Button>
                )}
                {(membershipStatus === "member" || membershipStatus === "admin") && (
                  <Button
                    onClick={handleLeaveGroup}
                    variant="outline"
                    disabled={membershipLoading}
                  >
                    {membershipLoading ? "Leaving..." : "Leave Group"}
                  </Button>
                )}
              </div>
              <p className="text-gray-600 mb-4">{group.description}</p>
              <div className="flex items-center gap-2 mb-4">
                <span className="text-sm font-medium">Status: </span>
                <span
                  className={`px-2 py-1 text-xs rounded-full ${
                    group.group_status === "public"
                      ? "bg-green-100 text-green-800"
                      : "bg-blue-100 text-blue-800"
                  }`}
                >
                  {group.group_status.charAt(0).toUpperCase() +
                    group.group_status.slice(1)}
                </span>
              </div>
            </div>

            {/* Tabs */}
            <Tabs defaultValue="discussions">
              <TabsList>
                <TabsTrigger value="discussions">Discussions</TabsTrigger>
                <TabsTrigger value="projects">Projects</TabsTrigger>
                <TabsTrigger value="resources">Resources</TabsTrigger>
                <TabsTrigger value="activity">Activity</TabsTrigger>
              </TabsList>
              <TabsContent value="discussions" className="p-4">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">Discussions</h2>
                  <CreateDiscussionDialog
                    open={isDiscussionDialogOpen}
                    onOpenChange={setIsDiscussionDialogOpen}
                    onSubmit={handleCreateDiscussion}
                    groupId={id}
                  />
                </div>

                {discussionsLoading ? (
                  <div className="text-center py-8">Loading discussions...</div>
                ) : discussions.length === 0 ? (
                  <div className="bg-gray-100 p-6 rounded-lg text-center">
                    <p>No discussions yet. Start a new one!</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {discussions.map((discussion) => (
                      <div
                        key={discussion.id}
                        className="border rounded-lg p-4 hover:bg-gray-50"
                      >
                        <h3 className="text-lg font-medium mb-1">
                          {discussion.title}
                        </h3>
                        <p className="text-gray-700 text-sm mb-2">
                          {expandedDiscussionContent[discussion.id] || !isContentLong(discussion.content)
                            ? discussion.content
                            : getTruncatedContent(discussion.content)}
                        </p>
                        {isContentLong(discussion.content) && (
                          <Button
                            variant="link"
                            size="sm"
                            className="p-0 h-auto text-blue-600 font-medium"
                            onClick={() => toggleDiscussionContent(discussion.id)}
                          >
                            {expandedDiscussionContent[discussion.id] ? "Show less" : "Read more"}
                          </Button>
                        )}
                        <div className="flex justify-between items-center text-sm text-gray-500 mb-2 mt-2">
                          <div>Started by {getUserNameById(discussion.user_id)}</div>
                          <div>
                            {formatDistanceToNow(
                              new Date(discussion.created_at),
                              { addSuffix: true }
                            )}
                          </div>
                        </div>

                        {/* Show Comments Button */}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleDiscussionComments(discussion.id)}
                          className="text-sm"
                        >
                          {expandedDiscussions[discussion.id] ? "Hide Comments" : "Show Comments"}
                        </Button>

                        {/* Comments Section */}
                        {expandedDiscussions[discussion.id] && (
                          <div className="mt-3 pt-3 border-t">
                            <h4 className="text-sm font-medium mb-2">Comments</h4>
                            {discussionComments[discussion.id]?.length > 0 ? (
                              <div className="space-y-2">
                                {discussionComments[discussion.id].map((comment) => (
                                  <div key={comment.id} className="bg-gray-50 p-2 rounded text-sm">
                                    <div className="flex items-center gap-2 mb-1">
                                      <Avatar className="h-6 w-6">
                                        <AvatarImage src={getUserImageById(comment.user_id)} alt={getUserNameById(comment.user_id)} />
                                        <AvatarFallback>{getUserNameById(comment.user_id)}</AvatarFallback>
                                      </Avatar>
                                      <span className="font-medium">{getUserNameById(comment.user_id) || "User"}</span>
                                      <span className="text-xs text-gray-500">
                                        {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}
                                      </span>
                                    </div>
                                    <p>{comment.content}</p>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <p className="text-sm text-gray-500">No comments yet.</p>
                            )}
                            
                            {/* Add comment input */}
                            <div className="mt-3">
                              <div className="flex flex-col gap-2">
                                <Textarea 
                                  value={commentText[discussion.id] || ''}
                                  onChange={(e) => setCommentText((prev) => ({
                                    ...prev,
                                    [discussion.id]: e.target.value,
                                  }))}
                                  placeholder="Write your comment here..."
                                  className="min-h-[80px] w-full text-sm resize-y"
                                  onKeyDown={(e) => {
                                    if (e.key === 'Enter' && e.ctrlKey) {
                                      e.preventDefault();
                                      handleCommentSubmit(discussion.id);
                                    }
                                  }}
                                />
                                <div className="flex justify-between items-center">
                                  <span className="text-xs text-gray-500">Press Ctrl+Enter to submit</span>
                                  <Button 
                                    size="sm" 
                                    disabled={submittingComment || !commentText[discussion.id]} 
                                    onClick={() => handleCommentSubmit(discussion.id)}
                                  >
                                    {submittingComment ? 'Sending...' : 'Submit Comment'}
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </TabsContent>
              <TabsContent value="projects" className="p-4">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">Projects</h2>
                  <Button size="sm">New Project</Button>
                </div>
                <div className="bg-gray-100 p-6 rounded-lg text-center">
                  <p>No projects yet. Create one to get started!</p>
                </div>
              </TabsContent>
              <TabsContent value="resources" className="p-4">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">Resources</h2>
                  <UploadResources
                    open={isResourceDialogOpen}
                    onOpenChange={setIsResourceDialogOpen}
                    onUploadComplete={handleResourceUpload}
                    groupId={id}
                  />
                </div>

                {resourcesLoading ? (
                  <div className="text-center py-8">Loading resources...</div>
                ) : resources.length === 0 ? (
                  <div className="bg-gray-100 p-6 rounded-lg text-center">
                    <p>No resources yet. Add papers, links, or notes!</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {resources.map((resource) => (
                      <div
                        key={resource.id}
                        className="border rounded-lg p-4 hover:bg-gray-50"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="text-lg font-medium mb-1">
                              {resource.title}
                            </h3>
                            {resource.description && (
                              <p className="text-gray-700 text-sm mb-2">
                                {resource.description}
                              </p>
                            )}
                            <div className="flex items-center text-sm text-gray-500">
                              <span className="mr-4">
                                Uploaded by {getUserNameById(resource.user_id)}
                              </span>
                              <span className="mr-4">
                                {formatDistanceToNow(
                                  new Date(resource.created_at),
                                  { addSuffix: true }
                                )}
                              </span>
                              <span>{formatFileSize(resource.fileSize)}</span>
                            </div>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            disabled={downloadingResource === resource.id}
                            onClick={() => handleResourceDownload(resource.id, resource.fileKey)}
                          >
                            {downloadingResource === resource.id ? 'Preparing...' : 'Download'}
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </TabsContent>
              <TabsContent value="activity" className="p-4">
                <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
                {activityLoading ? (
                  <div className="text-center py-8">Loading activities...</div>
                ) : activities.length === 0 ? (
                  <div className="bg-gray-100 p-6 rounded-lg text-center">
                    <p>No activity yet in this group.</p>
                  </div>
                ) : (
                  <div className="divide-y">
                    {activities.map((activity) => renderActivityItem(activity))}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="w-full md:w-1/3">
            <div className="bg-gray-50 p-4 rounded-lg mb-6">
              <h2 className="text-lg font-semibold mb-4">
                Members ({group.memberCount})
              </h2>

              {/* Admin section */}
              {group.adminInfo && group.adminInfo.length > 0 && (
                <div className="mb-4">
                  <h3 className="text-sm font-medium text-gray-600 mb-2">
                    Admins
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {group.adminInfo.map((admin) => (
                      <div
                        key={`admin-${admin.id}`}
                        className="flex flex-col items-center"
                      >
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={admin.imageUrl} alt={admin.name} />
                          <AvatarFallback>{admin.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <span className="text-xs mt-1 truncate max-w-[50px]">
                          {admin.name.split(" ")[0]}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Regular members section */}
              {group.memberInfo && group.memberInfo.length > 0 && (
                <div className="mb-4">
                  <h3 className="text-sm font-medium text-gray-600 mb-2">
                    Members
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {group.memberInfo.map((member) => (
                      <div
                        key={`member-${member.id}`}
                        className="flex flex-col items-center"
                      >
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={member.imageUrl} alt={member.name} />
                          <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <span className="text-xs mt-1 truncate max-w-[50px]">
                          {member.name.split(" ")[0]}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <Button variant="outline" className="w-full">
                View All Members
              </Button>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h2 className="text-lg font-semibold mb-4">About</h2>
              <div className="flex flex-col space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="font-medium">Created</span>
                  <span>{new Date(group.created_at).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Last Active</span>
                  <span>{new Date(group.last_active).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Status</span>
                  <span>{group.group_status}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}