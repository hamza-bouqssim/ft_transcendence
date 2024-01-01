"use client"
import React, { ReactNode, useEffect, useState } from 'react';
import { useRouter ,usePathname} from 'next/navigation';
import { isAuth } from './api';

interface AuthCheckProps {
  children: ReactNode;
}

const AuthCheck: React.FC<AuthCheckProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const router = useRouter();
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await isAuth();
        console.log(response)
        if(response.data.success)
            setIsAuthenticated(response.data.success);
        else{
            router.push("/signIn")
        }
      } catch (error) {
        console.log(error)
        router.push("/signIn")
      }
    };
    fetchData();
  }, []);

  if (isAuthenticated) {
    return <>{children}</>;
  }
  return null
};

export default AuthCheck;
