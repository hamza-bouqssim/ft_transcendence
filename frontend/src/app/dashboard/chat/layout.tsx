import CoversationSideBar from "@/app/components/CoversationSideBar/page";
import style from "./page.module.css"
// import { socket, socketContext } from "@/app/utils/context/socketContext";
export default async function UserLayout ({
    children
}: {
    children: React.ReactNode;
}) {
    return (
        // <socketContext.Provider value={socket}>
            <div className="h-full">
                {children} 
            </div>
        // </socketContext.Provider>
           
   )
}