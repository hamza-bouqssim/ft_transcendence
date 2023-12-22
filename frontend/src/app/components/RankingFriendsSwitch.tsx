import React, { useContext, useState ,useEffect} from 'react'
import InviteField from './InviteField';
import { faCheck, faPlus  } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import RankedFriends from './RankedFriends';
import Image from 'next/image';
import { socketContext } from '../utils/context/socketContext';
import { getRanking, getUserInfos } from '../utils/api';

const RankingFriendsSwitch = ({userId}) => {
    const [showRank, setShowRank] = useState(false);
    const [showFriends, setShowFriends] = useState(false);
    const [showSendReqCompo, setShowSendReqCompo] = useState(false);
    const [clickedButton, setClickedButton] = useState('user');
    const [showuser, setShowUser] = useState(true);
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
    const [players, setPlayers] = useState([]);

    const {Userdata} = useContext(socketContext);
    const [userinfo, setUserInfo] = useState("");

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        if (userId) {
          const response = await getUserInfos(userId);
          console.log("BAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA======> ",response);
          setUserInfo(response.data);
        }
      } catch (error) {
        console.log('Error fetching user information:', error);
      }
    };

    fetchUserInfo();
  }, [userId]);

    useEffect(() => {
      const fetchGameStates = async () => {
        try {
          const response = await getRanking();
          setPlayers(response.data);
        } catch (error) {
        console.log("Error fetching match history:", error);
        }
      };
      
      fetchGameStates();
      }, [Userdata?.id]);
  
  return (
    <div className='flex flex-col items-center gap-2 pt-5 pb-10 bg-white w-full h-full rounded-[70px] overflow-hidden'>
      <div className='w-[80%] h-[22%] p-2 bg-gray-100 rounded-[50px] flex gap-1 items-center '>

        <button onClick={_showUser} className={`w-1/2 ${clickedButton === 'user' ? 'bg-[#498CDA] text-white' : 'bg-gray-300 text-gray-600'} h-full rounded-3xl duration-300 hover:scale-105`}>User</button>
        <button  onClick={_showRank} className={`w-1/2 bg-[#498CDA] ${clickedButton === 'rank' ? 'bg-[#498CDA] text-white' : 'bg-gray-300 text-gray-600'} h-full rounded-3xl duration-300 hover:scale-105`}>Rank</button>
        <button onClick={_showFriends} className={`w-1/2 ${clickedButton === 'friends' ? 'bg-[#498CDA] text-white' : 'bg-gray-300 text-gray-600'} h-full rounded-3xl duration-300 hover:scale-105`}>Suggestion</button>

      </div>

      {/* {
        showuser && (
          <div className='pt-[10px]  flex justify-center items-center flex-col relative w-full h-[75%] rounded-[50px] text-black animate-bounce'>
            {Userdata?.avatar_url && <Image src={Userdata?.avatar_url}  
            className='w-[130px] h-[130px] shadow-lg rounded-full ' 
            alt="Description of the image" 
            width="250"  
            height="250"
            priority={true}
            />}
            <h1>{Userdata?.username}</h1>
            <h5>@{Userdata?.display_name}</h5>
          </div>
        )} */}

      {showuser && (
        <div className='pt-[10px]  flex justify-center items-center flex-col relative w-full h-[75%] rounded-[50px] text-black animate-bounce'>
          {userId ? (
            <>
              {userinfo.avatar_url && (
                <Image
                  src={userinfo.avatar_url}
                  className='w-[130px] h-[130px] shadow-lg rounded-full'
                  alt="Description of the image"
                  width="250"
                  height="250"
                  priority={true}
                />
              )}
              <h1>{userinfo.username}</h1>
              <h5>@{userinfo.display_name}</h5>
            </>
          ) : (
            // Render user information from Userdata
            <>
              {Userdata?.avatar_url && (
                <Image
                  src={Userdata?.avatar_url}
                  className='w-[130px] h-[130px] shadow-lg rounded-full'
                  alt="Description of the image"
                  width="250"
                  height="250"
                  priority={true}
                />
              )}
              <h1>{Userdata?.username}</h1>
              <h5>@{Userdata?.display_name}</h5>
            </>
          )}
        </div>
      )}

        


      {showRank && (
        
        
        <div className=' items-center justify-center  gap-10 relative w-full h-[75%] rounded-[50px] flex overflow-auto scrollbar-hide'>

          
          <div className='w-[110px] rounded-full bg-gray-100 h-[110px] border-solid border-4 border-amber-900 overflow-hidden'>
          <Image src={players[1]?.picture} className='w-[110px] h-[110px] rounded-full ' alt="Description of the image" width={250}   height={250} />
          </div>

         
          <div className='w-[140px] rounded-full bg-gray-100 h-[140px] top-0 absolute border-solid border-4 border-amber-500 overflow-hidden hover:bg-black'>
          <Image src={players[0]?.picture}  className='w-[140px] h-[140px] rounded-full ' alt="Description of the image" width={250}   height={250} />
          </div>
          
          <div className='w-[110px] rounded-full bg-gray-100 h-[110px] border-solid border-4 border-gray-700 overflow-hidden'>
          <Image src={players[2]?.picture}  className='w-[110px] h-[110px] rounded-full ' alt="Description of the image" width={250}   height={250} />
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
        <button  onClick={_backTo} className='absolute bottom-0 right-0 mb-[-35px] mr-4 rounded-full'>
          <FontAwesomeIcon icon={faCheck} className='bg-[#498CDA] w-[25px] h-[25px] p-1 rounded-full duration-300 hover:scale-105'/>
        </button>
      </div>
        )}
      
    </div>
  )
}

export default RankingFriendsSwitch