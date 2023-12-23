import React, { useContext, useState ,useEffect} from 'react'
import InviteField from './InviteField';
import { faCheck, faPlus  } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import RankedFriends from './RankedFriends';
import Image from 'next/image';
import { socketContext } from '../utils/context/socketContext';
import { getRanking, getUserInfos } from '../utils/api';

const RankingUserSwitch = ({userId, userInfo, _switch}) => {
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
   

    const _showUser = () => {
      setShowUser(true);
      setShowRank(false);
      setShowFriends(false);
      setShowSendReqCompo(false);
      setClickedButton('user');
    }
    const [players, setPlayers] = useState([]);

    const {Userdata} = useContext(socketContext);
    

  

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
        {_switch ? <><button  onClick={_showRank} className={`w-1/2 bg-[#498CDA] ${clickedButton === 'rank' ? 'bg-[#498CDA] text-white' : 'bg-gray-300 text-gray-600'} h-full rounded-3xl duration-300 hover:scale-105`}>Rank</button></>:null}

      </div>

      {
        showuser && (
          <div className='pt-[10px]  flex justify-center items-center flex-col relative w-full h-[75%] rounded-[50px] text-black animate-bounce'>
            {userInfo.avatar_url && <Image src={_switch ? userInfo.avatar_url : '/assets/unknown.png'}  
            className='w-[130px] h-[130px] shadow-lg rounded-full ' 
            alt="Description of the image" 
            width="250"  
            height="250"
            priority={true}
            />}
            <h1>{_switch ? userInfo.username: '-'}</h1>
            <h5>@{_switch ? userInfo.display_name: '-'}</h5>
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

      
      
    </div>
  )
}

export default RankingUserSwitch;