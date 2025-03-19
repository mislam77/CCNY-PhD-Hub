"use client";

import { useRouter } from 'next/navigation';
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { BadgeCheck } from "lucide-react";

export default function ResearchGroupCard({ group }) {
  const router = useRouter();

  const handleCardClick = () => {
    router.push(`/research/${group.id}`);
  };

  // Determine if we need to show a "+X more" badge
  const totalMembers = group.members.length;
  const displayedMembers = group.allMemberImages ? group.allMemberImages.length : 0;
  const additionalMembers = totalMembers - displayedMembers;

  return (
    <Card 
      className="overflow-hidden cursor-pointer hover:shadow-md transition-shadow" 
      onClick={handleCardClick}
    >
      <div className="relative w-full h-40">
        <Image
          src={group.image_url}
          alt={group.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover"
          priority
        />
      </div>
      <CardContent className="p-4">
        <h2 className="text-xl font-semibold">{group.title}</h2>
        <p className="text-sm text-gray-500 flex items-center gap-2">
          <span className={`px-2 py-0.5 text-xs rounded-full ${
            group.group_status === "public" ? "bg-green-100 text-green-800" : "bg-blue-100 text-blue-800"
          }`}>
            {group.group_status.charAt(0).toUpperCase() + group.group_status.slice(1)}
          </span>
          <span>{group.memberCount} {group.memberCount === 1 ? 'member' : 'members'}</span>
        </p>
        <p className="mt-2 text-sm line-clamp-2">{group.description}</p>

        <div className="flex items-center mt-4">
          {/* Display all member images with admin badge */}
          {group.allMemberImages && group.allMemberImages.map((member, index) => (
            <div key={index} className="relative w-8 h-8 -ml-2 first:ml-0">
              <div className="w-full h-full rounded-full border-2 border-white overflow-hidden relative">
                <Image
                  src={member.imageUrl || '/default-avatar.png'}
                  alt={`Member ${index + 1}`}
                  fill
                  className="rounded-full object-cover"
                />
              </div>
              {/* Admin badge */}
              {member.isAdmin && (
                <div className="absolute -bottom-1 -right-1 bg-white rounded-full w-4 h-4 flex items-center justify-center">
                  <BadgeCheck className="w-3 h-3 text-blue-500" />
                </div>
              )}
            </div>
          ))}
          
          {/* Show additional members count if needed */}
          {additionalMembers > 0 && (
            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center -ml-2 text-xs font-medium">
              +{additionalMembers}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}