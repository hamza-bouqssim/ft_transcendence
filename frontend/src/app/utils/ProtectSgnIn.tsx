import React, { ReactNode, useContext } from 'react'
import { socketContext } from './context/socketContext'
import { useParams } from 'next/navigation'
import { useRouter } from 'next/navigation'
interface AuthCheckProps {
    children: ReactNode;
  }
const ProtectSgnIn: React.FC<AuthCheckProps> = ({ children })=> {
    const {Userdata} = useContext(socketContext) 
    const route = useRouter()
    if(!Userdata)
        route.push("/dashboad")

  return (
    <div>
      {children}
    </div>
  )
}

export default ProtectSgnIn
