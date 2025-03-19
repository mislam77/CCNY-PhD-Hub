import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface FilterComponentProps {
  onFilterApply: (filters: { keyword: string }) => void;
}

export default function FilterComponent({ onFilterApply }: FilterComponentProps) {
  const [keyword, setKeyword] = useState("");

  const handleFilter = () => {
    onFilterApply({ keyword });
  };

  return (
    <div className="flex gap-4 mb-6">
      <Input 
        placeholder="Enter keyword" 
        className="w-full" 
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
      />
      <Select>
        <SelectTrigger className="w-40">
          <SelectValue placeholder="Concentration" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="machine learning">Machine Learning</SelectItem>
          <SelectItem value="biomedical science">Biomedical Science</SelectItem>
        </SelectContent>
      </Select>
      <Select>
        <SelectTrigger className="w-40">
          <SelectValue placeholder="Purpose" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="research">Research</SelectItem>
          <SelectItem value="collaboration">Collaboration</SelectItem>
        </SelectContent>
      </Select>
      <Button onClick={handleFilter}>Filter</Button>
    </div>
  );
}