import Link from "next/link";
import { Button } from "@/components/ui/button";

const ResourcesPage = () => {
    return ( 
        <div className="flex flex-col items-center min-h-screen bg-gray-100">
            <h1 className="text-4xl font-bold mb-8">
                Student Resources
            </h1>
            <Link href={"/resources/resources-guide"}>
                <Button>
                    Resource Guide
                </Button>
            </Link>
        </div>
     );
}
 
export default ResourcesPage;