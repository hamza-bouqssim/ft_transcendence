"use client"
import React from "react"
import CoversationSideBar from "@/app/components/CoversationSideBar/ConversationSideBar";

const CoversationPage = () =>
{
		return (
			<div className="flex  w-full h-screen xl:container xl:mx-auto">
				<div className ="w-full  h-full xl:w-[35%] xl:p-10 xl:pl-5  xl:pr-2 ">
					<CoversationSideBar/>
				</div>
				<div className="xl:my-10 xl:mr-10  w-full xl:ml-2 xl:w-[65%]  xl:rounded-[20px] xl:mt-32 hidden xl:flex items-center justify-center">INITIATE A CONVERSATION WITH A FRIEND YOU WANT TO PLAY WITH</div>
			</div>
)			

}

export default CoversationPage
