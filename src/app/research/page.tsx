"use client";

import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useRouter } from 'next/navigation';
import ResearchGroupCard from "@/components/ResearchGroupCard";
import FilterComponent from "@/components/FilterComponent";
import CreateResearchGroupModal from "@/components/CreateResearchGroupModal";

export default function ResearchPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [researchGroups, setResearchGroups] = useState([]);
  const router = useRouter();

  // Fetch research groups from API
  useEffect(() => {
    const fetchResearchGroups = async () => {
      try {
        const response = await fetch("/api/research");
        const data = await response.json();
        setResearchGroups(data);
      } catch (error) {
        console.error("Error fetching research groups:", error);
      }
    };

    fetchResearchGroups();
  }, []);

  // Function to update groups when a new group is added
  const handleGroupCreated = (newGroup) => {
    setResearchGroups((prevGroups) => [newGroup, ...prevGroups]);
    router.push(`/research/${newGroup.id}`);
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Research Groups</h1>
        <Button onClick={() => setIsModalOpen(true)}>Create Research Group</Button>
      </div>

      <FilterComponent />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        {researchGroups.map((group) => (
          <ResearchGroupCard key={group.id} group={group} />
        ))}
      </div>

      {isModalOpen && (
        <CreateResearchGroupModal
          onClose={() => setIsModalOpen(false)}
          onGroupCreated={handleGroupCreated} // Pass callback
        />
      )}
    </div>
  );
}