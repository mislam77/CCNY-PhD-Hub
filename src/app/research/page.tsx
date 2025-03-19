"use client";

import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import ResearchGroupCard from "@/components/ResearchGroupCard";
import FilterComponent from "@/components/FilterComponent";
import CreateResearchGroupModal from "@/components/CreateResearchGroupModal";

// Define the ResearchGroup interface
interface ResearchGroup {
  id: string | number;
  // Add other properties that your ResearchGroupCard component expects
}

export default function ResearchPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [researchGroups, setResearchGroups] = useState<ResearchGroup[]>([]);
  const [filters, setFilters] = useState<{ keyword: string }>({ keyword: "" });

  // Fetch research groups from API
  useEffect(() => {
    const fetchResearchGroups = async () => {
      try {
        // Construct URL with query parameters
        const queryParams = new URLSearchParams();
        if (filters.keyword) {
          queryParams.append('keyword', filters.keyword);
        }
        
        const url = `/api/research${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
        const response = await fetch(url);
        const data = await response.json();
        setResearchGroups(data);
      } catch (error) {
        console.error("Error fetching research groups:", error);
      }
    };

    fetchResearchGroups();
  }, [filters]); // Re-fetch when filters change

  // Function to update groups when a new group is added
  const handleGroupCreated = (newGroup: ResearchGroup): void => {
    setResearchGroups((prevGroups: ResearchGroup[]) => [newGroup, ...prevGroups]);
  };

  // Handle filter changes
  const handleFilterApply = (newFilters: { keyword: string }) => {
    setFilters(newFilters);
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Research Groups</h1>
        <Button onClick={() => setIsModalOpen(true)}>Create Research Group</Button>
      </div>

      <FilterComponent onFilterApply={handleFilterApply} />

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