import CoversationSideBar from "@/app/components/CoversationSideBar/page";
import './styles.css'
// import { socket, socketContext } from "@/app/utils/context/socketContext";
export default async function UserLayout ({
    children
}: {
    children: React.ReactNode;
}) {
    return (
            <div>
                {children} 
            </div>
           
   )
}