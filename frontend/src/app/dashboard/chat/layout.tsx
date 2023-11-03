import CoversationSideBar from "@/app/components/CoversationSideBar/page";
import Sidebar from "../../components/navbar/Sidebar"
export default async function UserLayout ({
    children
}: {
    children: React.ReactNode;
}) {
    return (
            <div className="h-full">
               
            {children} 
            </div>
   )
}