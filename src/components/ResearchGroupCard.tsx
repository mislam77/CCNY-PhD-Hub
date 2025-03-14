import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";

export default function ResearchGroupCard({ group }) {
  return (
    <Card className="p-4">
      <Image
        src={group.image_url}
        alt={group.title}
        width={200}
        height={200}
        className="w-full h-32 object-cover mb-4"
      />
      <h2 className="text-xl font-semibold">{group.title}</h2>
      <p className="text-sm text-gray-500">
        {group.group_status.charAt(0).toUpperCase() + group.group_status.slice(1)} Group - {group.memberCount} members
      </p>
      <p className="mt-2 text-sm">{group.description}</p>

      <div className="flex mt-4">
        {group.adminImages.map((imageUrl, index) => (
          <Image
            key={index}
            src={imageUrl}
            alt={`Admin ${index + 1}`}
            width={30}
            height={30}
            className="w-8 h-8 rounded-full border-2 border-white -ml-2"
          />
        ))}
      </div>
    </Card>
  );
}
