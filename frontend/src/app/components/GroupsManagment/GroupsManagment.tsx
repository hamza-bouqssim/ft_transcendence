"use client" 
import { IoMdAdd } from "react-icons/io";
import {useRouter,usePathname} from 'next/navigation'
interface ConversationTypes {
    id: string;
    name: string;
    lastMessage: string;
    image: string;
    lastDate: string;
  }
  
  const conversations: ConversationTypes[] = [
    {
      id: "1",
      name: "John",
      lastMessage: "Hello!",
      image: "https://imgs.search.brave.com/q1LfdV9YRvahK6U3b6iCYGwsp9B2DwP5EZUREYeG8jg/rs:fit:860:0:0/g:ce/aHR0cHM6Ly9pbWFn/ZXMuY3RmYXNzZXRz/Lm5ldC9ocmx0eDEy/cGw4aHEvNmJpNndL/SU01RERNNVUxUHRH/VkZjUC8xYzdmY2U2/ZGUzM2JiNjU3NTU0/OGE2NDZmZjliMDNh/YS9uYXR1cmUtcGhv/dG9ncmFwaHktcGlj/dHVyZXMuanBnP2Zp/dD1maWxsJnc9NjAw/Jmg9NDAw",
      lastDate: "2023-11-14",
    },
    {
      id: "2",
      name: "Alice",
      lastMessage: "Hi there!",
      image: "https://imgs.search.brave.com/q1LfdV9YRvahK6U3b6iCYGwsp9B2DwP5EZUREYeG8jg/rs:fit:860:0:0/g:ce/aHR0cHM6Ly9pbWFn/ZXMuY3RmYXNzZXRz/Lm5ldC9ocmx0eDEy/cGw4aHEvNmJpNndL/SU01RERNNVUxUHRH/VkZjUC8xYzdmY2U2/ZGUzM2JiNjU3NTU0/OGE2NDZmZjliMDNh/YS9uYXR1cmUtcGhv/dG9ncmFwaHktcGlj/dHVyZXMuanBnP2Zp/dD1maWxsJnc9NjAw/Jmg9NDAw", // Replace with the actual URL
      lastDate: "2023-11-13",
    },
    {
      id: "3",
      name: "Bob",
      lastMessage: "How are you?",
      image: "https://imgs.search.brave.com/q1LfdV9YRvahK6U3b6iCYGwsp9B2DwP5EZUREYeG8jg/rs:fit:860:0:0/g:ce/aHR0cHM6Ly9pbWFn/ZXMuY3RmYXNzZXRz/Lm5ldC9ocmx0eDEy/cGw4aHEvNmJpNndL/SU01RERNNVUxUHRH/VkZjUC8xYzdmY2U2/ZGUzM2JiNjU3NTU0/OGE2NDZmZjliMDNh/YS9uYXR1cmUtcGhv/dG9ncmFwaHktcGlj/dHVyZXMuanBnP2Zp/dD1maWxsJnc9NjAw/Jmg9NDAw", // Replace with the actual URL

      lastDate: "2023-11-12",
    },
    {
      id: "4",
      name: "Eve",
      lastMessage: "Nice to meet you!",
      image: "https://imgs.search.brave.com/q1LfdV9YRvahK6U3b6iCYGwsp9B2DwP5EZUREYeG8jg/rs:fit:860:0:0/g:ce/aHR0cHM6Ly9pbWFn/ZXMuY3RmYXNzZXRz/Lm5ldC9ocmx0eDEy/cGw4aHEvNmJpNndL/SU01RERNNVUxUHRH/VkZjUC8xYzdmY2U2/ZGUzM2JiNjU3NTU0/OGE2NDZmZjliMDNh/YS9uYXR1cmUtcGhv/dG9ncmFwaHktcGlj/dHVyZXMuanBnP2Zp/dD1maWxsJnc9NjAw/Jmg9NDAw", // Replace with the actual URL

      lastDate: "2023-11-11",
    },
    {
      id: "5",
      name: "Charlie",
      lastMessage: "Goodbye!",
      image: "https://imgs.search.brave.com/q1LfdV9YRvahK6U3b6iCYGwsp9B2DwP5EZUREYeG8jg/rs:fit:860:0:0/g:ce/aHR0cHM6Ly9pbWFn/ZXMuY3RmYXNzZXRz/Lm5ldC9ocmx0eDEy/cGw4aHEvNmJpNndL/SU01RERNNVUxUHRH/VkZjUC8xYzdmY2U2/ZGUzM2JiNjU3NTU0/OGE2NDZmZjliMDNh/YS9uYXR1cmUtcGhv/dG9ncmFwaHktcGlj/dHVyZXMuanBnP2Zp/dD1maWxsJnc9NjAw/Jmg9NDAw", // Replace with the actual URL

      lastDate: "2023-11-10",
    },
    {
      id: "6",
      name: "Grace",
      lastMessage: "See you later!",
      image: "https://imgs.search.brave.com/q1LfdV9YRvahK6U3b6iCYGwsp9B2DwP5EZUREYeG8jg/rs:fit:860:0:0/g:ce/aHR0cHM6Ly9pbWFn/ZXMuY3RmYXNzZXRz/Lm5ldC9ocmx0eDEy/cGw4aHEvNmJpNndL/SU01RERNNVUxUHRH/VkZjUC8xYzdmY2U2/ZGUzM2JiNjU3NTU0/OGE2NDZmZjliMDNh/YS9uYXR1cmUtcGhv/dG9ncmFwaHktcGlj/dHVyZXMuanBnP2Zp/dD1maWxsJnc9NjAw/Jmg9NDAw", // Replace with the actual URL

      lastDate: "2023-11-09",
    },
    {
      id: "7",
      name: "David",
      lastMessage: "What's up?",
      image: "https://imgs.search.brave.com/q1LfdV9YRvahK6U3b6iCYGwsp9B2DwP5EZUREYeG8jg/rs:fit:860:0:0/g:ce/aHR0cHM6Ly9pbWFn/ZXMuY3RmYXNzZXRz/Lm5ldC9ocmx0eDEy/cGw4aHEvNmJpNndL/SU01RERNNVUxUHRH/VkZjUC8xYzdmY2U2/ZGUzM2JiNjU3NTU0/OGE2NDZmZjliMDNh/YS9uYXR1cmUtcGhv/dG9ncmFwaHktcGlj/dHVyZXMuanBnP2Zp/dD1maWxsJnc9NjAw/Jmg9NDAw", // Replace with the actual URL

      lastDate: "2023-11-08",
    },
    {
        id: "7",
        name: "David",
        lastMessage: "What's up?",
        image: "https://imgs.search.brave.com/q1LfdV9YRvahK6U3b6iCYGwsp9B2DwP5EZUREYeG8jg/rs:fit:860:0:0/g:ce/aHR0cHM6Ly9pbWFn/ZXMuY3RmYXNzZXRz/Lm5ldC9ocmx0eDEy/cGw4aHEvNmJpNndL/SU01RERNNVUxUHRH/VkZjUC8xYzdmY2U2/ZGUzM2JiNjU3NTU0/OGE2NDZmZjliMDNh/YS9uYXR1cmUtcGhv/dG9ncmFwaHktcGlj/dHVyZXMuanBnP2Zp/dD1maWxsJnc9NjAw/Jmg9NDAw", // Replace with the actual URL
  
        lastDate: "2023-11-08",
      },
      {
        id: "7",
        name: "David",
        lastMessage: "What's up?",
        image: "https://imgs.search.brave.com/q1LfdV9YRvahK6U3b6iCYGwsp9B2DwP5EZUREYeG8jg/rs:fit:860:0:0/g:ce/aHR0cHM6Ly9pbWFn/ZXMuY3RmYXNzZXRz/Lm5ldC9ocmx0eDEy/cGw4aHEvNmJpNndL/SU01RERNNVUxUHRH/VkZjUC8xYzdmY2U2/ZGUzM2JiNjU3NTU0/OGE2NDZmZjliMDNh/YS9uYXR1cmUtcGhv/dG9ncmFwaHktcGlj/dHVyZXMuanBnP2Zp/dD1maWxsJnc9NjAw/Jmg9NDAw", // Replace with the actual URL
  
        lastDate: "2023-11-08",
      },
      {
        id: "7",
        name: "David",
        lastMessage: "What's up?",
        image: "https://imgs.search.brave.com/q1LfdV9YRvahK6U3b6iCYGwsp9B2DwP5EZUREYeG8jg/rs:fit:860:0:0/g:ce/aHR0cHM6Ly9pbWFn/ZXMuY3RmYXNzZXRz/Lm5ldC9ocmx0eDEy/cGw4aHEvNmJpNndL/SU01RERNNVUxUHRH/VkZjUC8xYzdmY2U2/ZGUzM2JiNjU3NTU0/OGE2NDZmZjliMDNh/YS9uYXR1cmUtcGhv/dG9ncmFwaHktcGlj/dHVyZXMuanBnP2Zp/dD1maWxsJnc9NjAw/Jmg9NDAw", // Replace with the actual URL
  
        lastDate: "2023-11-08",
      },
      {
        id: "7",
        name: "David",
        lastMessage: "What's up?",
        image: "https://imgs.search.brave.com/q1LfdV9YRvahK6U3b6iCYGwsp9B2DwP5EZUREYeG8jg/rs:fit:860:0:0/g:ce/aHR0cHM6Ly9pbWFn/ZXMuY3RmYXNzZXRz/Lm5ldC9ocmx0eDEy/cGw4aHEvNmJpNndL/SU01RERNNVUxUHRH/VkZjUC8xYzdmY2U2/ZGUzM2JiNjU3NTU0/OGE2NDZmZjliMDNh/YS9uYXR1cmUtcGhv/dG9ncmFwaHktcGlj/dHVyZXMuanBnP2Zp/dD1maWxsJnc9NjAw/Jmg9NDAw", // Replace with the actual URL
  
        lastDate: "2023-11-08",
      },
      {
        id: "7",
        name: "David",
        lastMessage: "What's up?",
        image: "https://imgs.search.brave.com/q1LfdV9YRvahK6U3b6iCYGwsp9B2DwP5EZUREYeG8jg/rs:fit:860:0:0/g:ce/aHR0cHM6Ly9pbWFn/ZXMuY3RmYXNzZXRz/Lm5ldC9ocmx0eDEy/cGw4aHEvNmJpNndL/SU01RERNNVUxUHRH/VkZjUC8xYzdmY2U2/ZGUzM2JiNjU3NTU0/OGE2NDZmZjliMDNh/YS9uYXR1cmUtcGhv/dG9ncmFwaHktcGlj/dHVyZXMuanBnP2Zp/dD1maWxsJnc9NjAw/Jmg9NDAw", // Replace with the actual URL
  
        lastDate: "2023-11-08",
      },
  ];
  const GroupsManagement = () => {
    const router = useRouter();
	const pathname = usePathname()
    return (
      <div className="text-black  my-10 h-[calc(100%-200px)] overflow-auto ">
        {conversations.map((data: ConversationTypes) => (
          <div key={data.id} onClick={() =>{router.push("/dashboard/groups/"+data.id)}}  className="cursor-pointer rounded-lg hover:bg-[#F2F3FD] flex items-start justify-between px-2 py-3">
            <div className="flex items-center justify-start">
                <img className="w-16 h-16  bg-cover rounded-full" src={data.image} alt="" />
                <div className="ml-4">
                <h1>{data.name}</h1>
                <h1>{data.lastMessage}</h1>
                </div>
            </div>
            <div>{data.lastDate}</div>
          </div>
        ))}
        <div className="md:h-16 h-28">

        </div>
      </div>
    );
  };
  

export default GroupsManagement;