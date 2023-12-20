"use client";

import { getMatchHistory, getStates, getUserInfos } from '@/app/utils/api';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Boxes from '@/app/components/Boxes';
import HistoryMatches from '@/app/components/HistoryMatches';
import RankingFriendsSwitch from '@/app/components/RankingFriendsSwitch';
import Image from 'next/image';
import "./page.css"
import RankingUserSwitch from '@/app/components/RankingUserSwitch';

const Dashboard = ({ params }: { params: { id: string } }) => {

  const [results, setResults] = useState({});
  const [history_match, setHistoryMatch] = useState([]);
  const [userinfo, setUserInfo] = useState("");
  
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        if (params.id) {
          const response = await getUserInfos(params.id);
          setUserInfo(response.data);
        }
      } catch (error) {
        console.log('Error fetching user information:', error);
      }
    };

    fetchUserInfo();
  }, [params.id]);

  useEffect(() => {
    const fetchMatchHistory = async () => {
      try {
        if (params.id) {
          const response = await getMatchHistory(params.id);
          setHistoryMatch(response.data);
        }
      } catch (error) {
        console.log('Error fetching match history:', error);
      }
    };

    fetchMatchHistory();
  }, [params.id]);

  useEffect(() => {
    const fetchGameStates = async () => { 
      try {
        if (params.id) {
          const response = await getStates(params.id);
          setResults(response.data);
        }
      } catch (error) {
        console.log('Error fetching match history:', error);
      }
    };

    fetchGameStates();
  }, [params.id]);

	  

	return (
		<div>
			<div className="container">

				<div className="row">

					<div className="col-1">
						<div className="play relative rounded-[54px]">
						<Image
  							src="/assets/hand.png"
  							className="thehand absolute  -top-[41px] -right-[9px] rounded-r-full w-[490px] animate-bounce"
  							alt=""
  							width="500"
  							height="500"
							priority={true}
						/>
							<h1 className="play-button drop-shadow-md">{userinfo.display_name}</h1>
						</div>
						<div className="boxes">
							<Boxes title="WINS" value={results?.win} color="#6A67F3"/>
							<Boxes title="RANK" value={results?.level} color="#498CDA"/>
							<Boxes title="LOSSES" value={results?.lose} color="#FC7785"/>
						</div>
						<h1 className="mt-[20px]">History</h1>
						<div className=" history-header mt-[20px] shadow-lg w-full h-[40px] bg-[#79a9f28d] rounded-[40px] flex justify-between px-1 py-1 ">
								<div className="w-[23%] text-center ">
								<h1>Players</h1>
								</div>

								<div className="w-[23%] text-center ">
								<h1>Duration</h1>
								</div>

								<div className="w-[23%] text-center ">
								<h1>Date</h1>
								</div>

								<div className="w-[23%] text-center ">
								<h1>Total Matches</h1>
								</div>

						</div>
						<div className="his overflow-y-auto  h-[120px] scrollbar-hide">
							{
								history_match.map((_history, index) => (

									<HistoryMatches
									key={index}
									playerOne={_history.playerOne}
									resultOne={_history.resultOne} 
									resultTwo={_history.resultTwo} 
									playerTwo={_history.playerTwo} 
									duration={_history.duration} 
									date={_history.date} 
									totalMatches={_history.totalMatch}/>
								))
							}

						</div>

					</div>
					
					<div className="col-2">

						<div className="rank-container overflow-hidden p-2">
							   <RankingUserSwitch userId={params.id} userInfo={userinfo}/>
						</div>

						<div className="achievements-container">
							<div className="achievements">
								<h1>Achievements</h1>
								<div className="my-achv">
								<div className="my"><Image className={`my ease-in duration-100 hover:scale-105 ${results.win < 0 ? 'grayscale blur-[3px]':'grayscale-0' }` } src="/assets/first.jpg" width="200" height="200"/></div>
								<div className="my"><Image className={`my ease-in duration-100 hover:scale-105 ${results.win < 2 ? 'grayscale blur-[3px]':'grayscale-0' }` } src="/assets/second.jpg" width="200" height="200"/></div>
								<div className="my"><Image className={`my ease-in duration-100 hover:scale-105 ${results.win < 4 ? 'grayscale blur-[3px]':'grayscale-0' }`} src="/assets/third.jpg" width="200" height="200"/></div>
								<div className="my"><Image className={`my ease-in duration-100 hover:scale-105 ${results.win < 6 ? 'grayscale blur-[3px]':'grayscale-0' }` } src="/assets/fourth.jpg" width="200" height="200"/></div>
								<div className="my"><Image className={`my ease-in duration-100 hover:scale-105 ${results.win < 8 ? 'grayscale blur-[3px]':'grayscale-0' }` } src="/assets/fifth.jpg" width="200" height="200"/></div>
								<div className="my"><Image className={`my ease-in duration-100 hover:scale-105 ${results.win < 12 ? 'grayscale blur-[3px]':'grayscale-0' }` } src="/assets/sixth.jpg" width="200" height="200"/></div>
									
								</div>
							</div>
						</div>

					</div>
				</div>

			</div>
    	</div>
	);
};
export default Dashboard;
