import { Qrcodeform } from "@/app/components/Qrcodefom";


const TwoFactorVerify = () =>
{
  return (
    <div className="absolute left-0 z-10 right-0 bottom-0 top-0 bg-[#00000095] backdrop-blur-md opacity-100">

      <Qrcodeform closeQrForm={closeQrForm} />
    </div>
  );
}
export default TwoFactorVerify;