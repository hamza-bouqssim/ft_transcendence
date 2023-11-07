"use client"
import CoversationSideBar from "@/app/components/CoversationSideBar/page";
// import './styles.css'
import { Provider } from "react-redux";
import { Socket } from "socket.io-client";
import { User } from "@/app/utils/types";
import { PropsWithChildren } from "react";
import { store } from "@/app/store";
import { socket, socketContext } from "@/app/utils/context/socketContext";
import {enableMapSet} from 'immer';

enableMapSet();

type Props = {
	// user?: User;
	// setUser : React.Dispatch<React.SetStateAction<User | undefined>>;
	socket : Socket;
}

function AppWithProviders({children} : PropsWithChildren & Props){

	return (
		<Provider store={store}>
			<socketContext.Provider value={socket}>
				{children}
			</socketContext.Provider>
		</Provider>
	)

}
	
export default async function UserLayout ({children}: {children: React.ReactNode;}) {
    return (
        <AppWithProviders  socket={socket}> 

            <div>
                {children} 
            </div>
        </AppWithProviders>

           
   )
}