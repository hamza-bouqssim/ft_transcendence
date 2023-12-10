import React, { useEffect, useState } from 'react'
import { generateQrcode } from '../utils/api'
import QRCode from 'qrcode.react';

export const Qrcodeform = () => {
  const [qrCodeData, setQRCodeData] = useState(null);

  useEffect(() => {

         generateQrcode().then((res)=>{

           setQRCodeData(res.data)
         }) // Replace with your server endpoint
  
  }, []);
  console.log("dasd")

  return (
    <div className="w-[500px] h-[500px] z-30 bg-white absolute top-0 left-0 bottom-0 right-0  m-auto">
           {qrCodeData && <QRCode value={qrCodeData} />}
    </div> 

  )
}