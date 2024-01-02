
import React, { ReactNode, useContext, useEffect, useState } from 'react'
import { socketContext } from './context/socketContext'
import { useRouter } from 'next/navigation'
import { is2fa, isAuth } from './api';
interface AuthCheckProps {
    children: ReactNode;
  }
const ProtectTwofa: React.FC<AuthCheckProps> = ({ children })=> {
    const router = useRouter();

    useEffect(() => {
        const fetchData = async () => {
          try {
            const is2fares = await is2fa();
            if(is2fares.status === 401)
                router.push("/dashboard")
          } 
          catch(err:any)
          {
            router.push("/signIn")
          }
        };
        fetchData();
      }, []);
      return <>{children}</>;
}


export default ProtectTwofa
