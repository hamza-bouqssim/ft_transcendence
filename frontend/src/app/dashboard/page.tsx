"use client";

import React, { useEffect, useState } from "react";
import { getAuthUser } from "../utils/api";
import { redirect, useRouter } from "next/navigation";
import { User } from "../utils/types";
import { getSession } from "next-auth/react";
import "./page.css"


const Dashboard = () => {

	return (
		<div>
			<div className="container">

				<div className="row">

					<div className="col-1">
						<div className="play">
							<img src="/home/hbouqssi/Desktop/lastnolast/frontend/public/assets/hand.png" alt="" />
							<button type="button" className="play-button">Play Now!</button>
						</div>
						<div className="boxes">
						<div className="box-1" style={{ backgroundColor: '#6A67F3' }}>
							<h1>WINS</h1>
							<h1>23</h1>
						</div>
						<div className="box-1" style={{backgroundColor: '#498CDA'}}>
							<h1>RANK</h1>
							<h1>4</h1>
						</div>
						<div className="box-1" style={{backgroundColor: '#FC7785'}}>
							<h1>LOSSES</h1>
							<h1>10</h1>
						</div>
						</div>
						

					</div>
					
					
					
					<div className="col-2">

						<div className="rank-container">
							<div className="rank-friend">
								<div className="rank-friend-buttons">
								<button type="button" className="rank-friend-button" style={{backgroundColor: '#498CDA', color: 'white'}}>RANK</button>
								<button type="button" className="rank-friend-button" style={{backgroundColor: 'rgba(128, 128, 128, 0.09);', color: '#949494'}}>FRIENDS</button>
								</div>
							</div>
						</div>

						<div className="achievements-container">
							<div className="achievements">
								<h1>Achievements</h1>
								<div className="my-achv">
									<div className="my"></div>
									<div className="my"></div>
									<div className="my"></div>
									<div className="my"></div>
									<div className="my"></div>
									<div className="my"></div>
									
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
