"use client"
import AuthCheck from "@/app/utils/AuthCheck"
import { Qrcodeform } from "../../components/Qrcodefom"
import { confirm, verifyCode } from "../../utils/api"
import { faXmark } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useRouter } from "next/navigation"
import { useState } from "react"
import ProtectTwofa from "@/app/utils/ProtectTwofa"

const verifyTwoFactor = () => {

    const [Loading, setLoading] = useState(false);
    const [otp, setOtp] = useState("");
    const [isVerified, setIsVerified] = useState(false);
    const [message, setMessage] = useState("")
    const router = useRouter();

    const _verificationCode = async () => {
        // setLoading(true);
          await confirm(otp).then((res)=>{
            setIsVerified(res.data.success);
            setMessage(res.data.message)
            if(res.data.success)
                router.push('/dashboard');
            // setLoading(false);
          })
          .catch((e) =>{
        //   setLoading(false);
        })
      }
      const toSignInCompo = () => {
        router.push('/signIn');
      }

    return (
     <ProtectTwofa>


        <div className="absolute left-0 z-10 right-0 bottom-0 top-0 bg-[#0000005f] backdrop-blur-[0px] opacity-100">
            <div className="w-[380px] h-[600px] z-30 bg-white absolute top-0 left-0 bottom-0 right-0 m-auto  drop-shadow-xl rounded-[20px] overflow-hidden">
       <div className="h-full flex flex-col items-center  font-['Whitney_Semibold'] relative">
        <div className='w-full h-[14%] '>
            <FontAwesomeIcon icon={faXmark} onClick={toSignInCompo} className='text-black text-[35px] border-2 rounded-xl px-2 absolute top-6 right-8 cursor-pointer hover:bg-[--purple-color] hover:text-white' />
          </div>
        <div className='flex justify-center items-center  h-[80%] w-full flex-col p-5 gap-8 -mt-6'>
          <div className='ml-7 mr-auto'>
            <h1 className="text-black font-['Whitney_Semibold'] text-2xl font-bold">Authenticate Your Account</h1>
            <span className="text-black font-['Whitney_Semibold'] text-xs text-center">Enter the code genereted by your 2-factor auth App</span>
          </div>

          <div className='w-full border-t relative'>
            <span className='absolute  -top-[15px] px-3 left-[50%] -translate-x-[50%] bg-white text-black text-lg'>Verification Code</span>
          </div>

            <input type="text" className='w-[80%] h-10 py-5 text-black text-center text-xl tracking-[5px] rounded-lg border-2 border-[--purple-color] placeholder:tracking-normal' placeholder='Enter Your Code' value={otp} onChange={(e)=> setOtp(e.target.value)} maxLength={6} required/>

            <hr className='w-full'/>
            {Loading ? (
              <button className='w-[80%] bg-[--purple-color]  py-3 rounded-lg cursor-pointer hover:bg-[--pink-color] ease-in-out duration-300' >Loading...</button>
              
              ) : (
                <button className='w-[80%] bg-[--purple-color]  py-3 rounded-lg cursor-pointer hover:bg-[--pink-color] ease-in-out duration-300 text-white' onClick={_verificationCode}>Verify</button>
                
                )}
          </div>
          {message != "" && (
            <div>
          {/* {isVerified ? ( */}
            <p style={{ color: isVerified ? 'green' : 'red' }} className="font-bold font-['Whitney_Semibold']">{message}</p>
          {/* ) : (
            <p style={{ color: 'red' }}>Invalid 2FA CODE</p>
          )} */}
        </div>
      )}

       </div>
    </div> 
        </div>

      </ProtectTwofa>
    )
}

export default verifyTwoFactor