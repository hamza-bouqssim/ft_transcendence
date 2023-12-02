"use client"
import React from 'react'


interface Friend {
    id: number;
    username: string;
    image: string;
    displayname: string;
}

const friend: Friend [] = [
    { id: 1, username: 'john_doe', image: 'https://mjalloul.vercel.app/user.svg', displayname: 'Admin' },
    { id: 2, username: 'jane_smith', image: 'https://mjalloul.vercel.app/user.svg', displayname: 'User' },
    { id: 3, username: 'bob_ross', image: 'https://mjalloul.vercel.app/user.svg', displayname: 'User' },
    { id: 4, username: 'alice_wonderland', image: 'https://mjalloul.vercel.app/user.svg', displayname: 'Admin' },
    { id: 5, username: 'charlie_brown', image: 'https://mjalloul.vercel.app/user.svg', displayname: 'User' },
    { id: 6, username: 'dorothy_gale', image: 'https://mjalloul.vercel.app/user.svg', displayname: 'Admin' },
    { id: 7, username: 'edward_scissorhands', image: 'https://mjalloul.vercel.app/user.svg', displayname: 'User' },
    { id: 8, username: 'frankenstein_monster', image: 'https://mjalloul.vercel.app/user.svg', displayname: 'User' },
    { id: 9, username: 'grace_hopper', image: 'https://mjalloul.vercel.app/user.svg', displayname: 'Admin' },
    { id: 10, username: 'harry_potter', image: 'https://mjalloul.vercel.app/user.svg ', displayname: 'User' },
];
  
interface MemberUserProps {
  idUserAdd: string; // Assuming idUserAdd is of type string, adjust as needed
  setIdUserAdd: React.Dispatch<React.SetStateAction<string>>; // Adjust the type based on your use case
}

export const MemberUser: React.FC<MemberUserProps> = ({ idUserAdd, setIdUserAdd }) => {

  const handleRemoveUser = (userId: string) => {
    const updatedUsers = idUserAdd.filter((id:string) => id !== userId);
    setIdUserAdd(updatedUsers);
  };

  const handleAddUser = (userId: string) => {
    setIdUserAdd((prevIds:any) => [...prevIds, userId]);
  };
    return (
      <> 
        <div className="flex items-center justify-center">
                  <input className="rounded-full mb-1 w-full text-black focus:outline-none   bg-[#D9D9D9] bg-opacity-20  p-3" placeholder="Search Friend"></input>
        </div>
        <div className=" no-scrollbar ">
          {friend.map((user) => (
            <div key={user.id} className="flex items-center justify-between my-2">
              <div className="flex items-center justify-center">
                <img className="w-16" src={user.image} alt={user.displayname} />
                <div className="ml-2 ">
                  <h2>{user.username}</h2>
                  <h2 className="text-[13px] text-slate-400">{user.displayname}</h2>
                </div>
              </div>
              {idUserAdd.includes(user.id) ? <button onClick={() => handleRemoveUser(user.id)} className="bg-[#EA7F87] text-white text-[14px] p-2 rounded-[5px]" >remove user</button>
                :
                <button onClick={() =>handleAddUser(user.id) } className="bg-[#5B8CD3] text-white text-[14px] p-2 rounded-[5px]" >Add user</button>
              }
            </div>
          ))}
        </div>
      
      </>
    );
  };
