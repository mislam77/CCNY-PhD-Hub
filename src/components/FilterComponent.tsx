import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

export default function FilterComponent() {
  return (
    <div className="flex gap-4 mb-6">
      <Input placeholder="Enter keyword" className="w-full" />
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
      <Button>Filter</Button>
    </div>
  );
}