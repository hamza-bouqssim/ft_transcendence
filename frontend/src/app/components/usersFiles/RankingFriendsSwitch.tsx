import React, { useContext, useEffect, useState } from 'react'
import InviteField from '../InviteField';
import { faCheck, faPlus  } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import RankedFriends from '../RankedFriends';
import { socketContext } from '@/app/utils/context/socketContext';
import Image from 'next/image';
import { fetchUserInfo } from '@/app/store/usersSlice';
import { FriendsTypes, User, UsersTypes } from '@/app/utils/types';
import { AppDispatch } from '@/app/store';
import { useDispatch } from 'react-redux';
import { useParams } from 'next/navigation';

const RankingFriendsSwitch = () => {
    const [showRank, setShowRank] = useState(false);
    const [showFriends, setShowFriends] = useState(false);
    const [showSendReqCompo, setShowSendReqCompo] = useState(false);
    const [clickedButton, setClickedButton] = useState('user');
    const [showuser, setShowUser] = useState(true);
    const [userData, setUserData] = useState<UsersTypes | null>(null);
    console.log("tes");

    const _showRank = () => {
      setShowRank(true);
      setShowFriends(false);
      setShowSendReqCompo(false);
      setShowUser(false);
      setClickedButton('rank');
    }
    const _showFriends = () =>{
      setShowFriends(true);
      setShowRank(false);
      setShowSendReqCompo(false);
      setShowUser(false);
      setClickedButton('friends');
    }
    const _sendreq = () => {
      setShowSendReqCompo(true);
      setShowFriends(false);
      setShowRank(false);
      setShowUser(false);
      setClickedButton('friends');
    }
    const _backTo = () => {
      setShowFriends(true);
      setShowRank(false);
      setShowSendReqCompo(false);
      setShowUser(false);
      setClickedButton('friends');
    }

    const _showUser = () => {
      setShowUser(true);
      setShowRank(false);
      setShowFriends(false);
      setShowSendReqCompo(false);
      setClickedButton('user');
    }
    const [players, setPlayers] = useState([
      {
        "rank": 1,
        "username": "rgatnaou",
        "picture": "https://cdn.landesa.org/wp-content/uploads/default-user-image.png"
      },
      {
        "rank": 2,
        "username": "ykhadiri",
        "picture": "https://cdn.landesa.org/wp-content/uploads/default-user-image.png"
      },
      {
        "rank": 3,
        "username": "souchen",
        "picture": "https://cdn.landesa.org/wp-content/uploads/default-user-image.png"
      },

      {
        "rank": 4,
        "username": "mjalloul",
        "picture": "https://cdn.landesa.org/wp-content/uploads/default-user-image.png"
      },
      {
        "rank": 5,
        "username": "abdollah",
        "picture": "https://cdn.landesa.org/wp-content/uploads/default-user-image.png"
      },
      {
        "rank": 6,
        "username": "redone",
        "picture": "https://cdn.landesa.org/wp-content/uploads/default-user-image.png"
      }
    ]);
    const dispatch = useDispatch<AppDispatch>();

    const { id } = useParams();
      
    useEffect(() => {
      const id_user = id;
      dispatch(fetchUserInfo(id_user))
        .unwrap()
        .then((data: any) => {
          console.log("API Response:", data.data);
    
          // Assuming you want to create a new object with display_name and username
          const modifiedUserData: UsersTypes = {
            id: data.data.id,
            email: data.data.email,
            username: data.data.username,
            display_name: data.data.display_name,
            avatar_url: data.data.avatar_url,
            status: data.data.status,
          };
    
          setUserData(modifiedUserData);
        })
        .catch((err: any) => console.log(err));
    }, [id, dispatch]);

    console.log("user hereeee->", userData?.display_name);
  
  return (
    <div className='flex flex-col items-center gap-2 pt-5 pb-10 bg-white w-full h-full rounded-[70px] overflow-hidden'>
      <div className='w-[80%] h-[22%] p-2 bg-gray-100 rounded-[50px] flex gap-1 items-center '>

        <button onClick={_showUser} className={`w-1/2 ${clickedButton === 'user' ? 'bg-[#498CDA] text-white' : 'bg-gray-300 text-gray-600'} h-full rounded-3xl duration-300 hover:scale-105`}>User</button>
        <button  onClick={_showRank} className={`w-1/2 bg-[#498CDA] ${clickedButton === 'rank' ? 'bg-[#498CDA] text-white' : 'bg-gray-300 text-gray-600'} h-full rounded-3xl duration-300 hover:scale-105`}>Rank</button>
        <button onClick={_showFriends} className={`w-1/2 ${clickedButton === 'friends' ? 'bg-[#498CDA] text-white' : 'bg-gray-300 text-gray-600'} h-full rounded-3xl duration-300 hover:scale-105`}>Suggestion</button>

      </div> 

      {
        showuser && (
          <div className='pt-[10px]  flex justify-center items-center flex-col relative w-full h-[75%] rounded-[50px] text-black animate-bounce'>
            <Image src={userData?.avatar_url} className='w-[145px] h-[145px] rounded-full border-solid border-4 border-[#498CDA]' alt="Description of the image" width={60}   height={60} />

            <h1>{userData?.display_name}</h1>
            <h5>@{userData?.username}</h5>
          </div>
        )}  


       {showRank && (
        
        
        <div className=' items-center justify-center  gap-10 relative w-full h-[75%] rounded-[50px] flex overflow-auto scrollbar-hide'>

          
          <div className='w-[110px] rounded-full bg-gray-100 h-[110px] border-solid border-4 border-amber-900 overflow-hidden'>
            <Image src={players[2]?.picture}  className='w-[110px] h-[110px] rounded-full ' alt="Description of the image" width={60}   height={60} />

            
          </div>

         
          <div className='w-[140px] rounded-full bg-gray-100 h-[140px] top-0 absolute border-solid border-4 border-amber-500 overflow-hidden hover:bg-black'>
          <Image src={players[0]?.picture}  className='w-[140px] h-[140px] rounded-full ' alt="Description of the image" width={60}   height={60} />

          </div>
          
          <div className='w-[110px] rounded-full bg-gray-100 h-[110px] border-solid border-4 border-gray-700 overflow-hidden'>
          <Image src={players[1]?.picture} className='w-[110px] h-[110px] rounded-full ' alt="Description of the image" width={60}   height={60} />

          </div>

          <div className='absolute  w-[50%] mt-[150px] top-2 text-black'>

          {players.slice(3).map((player, index) => (
            <RankedFriends key={index} rank={player.rank} picture={player.picture} username={player.username}/>
          ))}
          
          </div>

        </div>
      )} 

      {showFriends && (

        <div className='relative w-[90%] h-[75%] flex flex-col'>

        <div className=' overflow-auto scrollbar-hide'>
          <InviteField />
         
        </div>

          <button  onClick={_sendreq} className='absolute bottom-0 right-0 mb-[-35px] mr-4 rounded-full'>
          <FontAwesomeIcon icon={faPlus} className='bg-[#498CDA] w-[25px] h-[25px] p-1 rounded-full duration-300 hover:scale-105'/>
          </button>
        </div>

        )}

      {showSendReqCompo && (

      <div className='relative w-[90%] h-[75%] flex flex-col'>
        <div className='w-full h-[25%] justify-between flex  p-1'>
          <input type="text" className="placeholder-[#949494] bg-[#F2F3FD]  rounded-[10px] outline-none px-[4px] text-[#949494]" placeholder="Search For a Friend" />
          <button className='h-full bg-[#498CDA] w-[49%] rounded-[10px]'>Search</button>

        </div>
        {/* <button  onClick={_backTo} className='absolute bottom-0 right-0 mb-[-35px] mr-4 rounded-full'>
          <FontAwesomeIcon icon={faCheck} className='bg-[#498CDA] w-[25px] h-[25px] p-1 rounded-full duration-300 hover:scale-105'/>
        </button> */}
      </div>
        )}
      
    </div>
  )
}

export default RankingFriendsSwitch