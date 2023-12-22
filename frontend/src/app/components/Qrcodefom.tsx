"use client";
import React, { useContext, useEffect, useState } from 'react'
import { generateQrcode, verifyCode } from '../utils/api'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faXmark } from '@fortawesome/free-solid-svg-icons';
import { useRouter } from 'next/navigation';
import { socketContext } from '../utils/context/socketContext';
import Image from 'next/image';

interface Props {
  closeQrForm :  () => void;
}

export function Qrcodeform({closeQrForm } : Props) {
  const {Userdata,setUserdata} = useContext(socketContext);
  const [qrCodeData, setQRCodeData] = useState("");
  const [otp, setOtp] = useState("");
  const [Loading, setLoading] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [message, setMessage] = useState("");
  const router = useRouter();
  useEffect(() => {
    
    generateQrcode().then((res)=>{
      setQRCodeData(res.data.qrcode)
    }).catch(() => {
      console.log("Error");
    })
    
  }, []);
  const _verificationCode = async () => {
    setLoading(true);
      await verifyCode(otp).then((res)=>{
        setMessage(res.data.message);
        setIsVerified(res.data.success);
        setUserdata({...Userdata, tfa_enabled: res.data.success});
        setLoading(false);
       
      })
      .catch((e) =>{
      setLoading(false)
      console.log("error:", e);
    })
  }
       console.log("isVerified:", isVerified) 
  return (
    <div className="w-[380px] h-[600px] z-30 bg-white absolute top-0 left-0 bottom-0 right-0 m-auto rounded-[20px] overflow-hidden">
       <div className="h-full flex flex-col items-center  font-['Whitney_Semibold'] relative">
        <div className='w-full h-[14%] '>
            <FontAwesomeIcon icon={faXmark} onClick={closeQrForm} className='text-black text-[35px] border-2 rounded-xl px-2 absolute top-6 right-8 cursor-pointer hover:bg-[--purple-color] hover:text-white' />
          </div>
        <div className='flex justify-center items-center  h-[80%] w-full flex-col p-5 gap-8 -mt-6'>
          <div className='ml-7 mr-auto'>
            <h1 className="text-black font-['Whitney_Semibold'] text-2xl">Two-Factor Authentication</h1>
            <span className="text-black font-['Whitney_Semibold'] text-xs">Enable and secure your account by scanning this QR code</span>
          </div>

          <Image src={qrCodeData ? qrCodeData : ""} alt="" className=' border-solid  border-orange-800 w-[165px]' width={165} height={165}/>

          <div className='w-full border-t relative'>
            <span className='absolute  -top-[15px] px-3 left-[50%] -translate-x-[50%] bg-white text-black text-lg'>Verification Code</span>
          </div>

            <input type="text" className='w-[80%] h-10 py-5 text-black text-center text-xl tracking-[5px] rounded-lg border-2 border-[--purple-color] placeholder:tracking-normal' placeholder='Enter Your Code' value={otp}  onChange={(e) => setOtp((e.target.value))} maxLength={6} required/>

            <hr className='w-full'/>
            {Loading ? (
            <button className='w-[80%] bg-[--purple-color]  py-3 rounded-lg cursor-pointer hover:bg-[--pink-color] ease-in-out duration-300' >Loading...</button>

            ) : (
              <button className='w-[80%] bg-[--purple-color]  py-3 rounded-lg cursor-pointer hover:bg-[--pink-color] ease-in-out duration-300' onClick={_verificationCode} >Verify</button>

            )}
            {message != "" && (
            <p style={{ color: isVerified ? 'green' : 'red' }}>{message}</p>
            )}
          </div>

       </div>
    </div> 

  )
}

