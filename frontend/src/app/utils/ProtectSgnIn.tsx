import React, { ReactNode, useContext, useEffect, useState } from 'react'
import { socketContext } from './context/socketContext'
import { useRouter } from 'next/navigation'
import { isAuth } from './api';
interface AuthCheckProps {
    children: ReactNode;
  }
const ProtectSgnIn: React.FC<AuthCheckProps> = ({ children })=> {
  const router = useRouter();
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await isAuth();
        if(response.status===200)
            router.push("/dashboard")
      } catch (error) {
      }
    };
    fetchData();
  }, []);

  return <>{children}</>;

}

export default ProtectSgnIn

