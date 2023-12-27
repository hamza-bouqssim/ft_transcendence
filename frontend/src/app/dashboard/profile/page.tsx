import Image from 'next/image'
import imageHamza from '/public/assets/hamza.png'
import AuthCheck from '@/app/utils/AuthCheck';
const Profile = () =>
{
    return(
        <AuthCheck>

        <div className=' absolute top-0 w-full h-full'>
            <div className="h-auto  w-auto flex flex-col  xl:ml-96 lg:ml-72 md:mx-4 max-w-[2000px] min-[3200px]:m-auto font-['Whitney_Bold']">
                <h1 className="xl:text-[100px] lg:text-2xl text-xl mt-20">
                    Profile
                </h1>
                <div className='md:relative h-auto w-full mb-7 md:h-[250px] mt-10 lg:mt-40'>
                    <div className='left-8 md:absolute top-0  z-10 mb-5 '>

                        <Image className='bg-[#D5DAF6] rounded-full w-[150px] h-[150px] lg:h-[200px] lg:w-[200px] m-auto'
                        src = {imageHamza}
                        alt= 'Your Avatar Image'
                        width={200}
                        height={200}
                        />
                        <h1 className='text-center 2xl:text-4xl lg:text-lg  text-sm'>HAMZA BOUQSSIM</h1>
                    </div>
                    <div className=" bg-[#ffffff38]  md:absolute bottom-0 w-full rounded-[30px] px-5  py-7 flex  lg:flex-row flex-col items-center gap-9 justify-between" >
                        <div><h1 className='w-[150px]'></h1></div>
                        <div className='flex text-[#ffffff99]  2xl:text-4xl md:text-lg'>
                            <div className='text-center   border-[#ffffff81] px-8 border-r-2'>
                                <h1>Total Games</h1>
                                <h1 className='text-white mt-3'>7</h1>
                            </div>
                            <div className='text-center   border-[#ffffff81] px-8 border-r-2'>
                                <h1>Wins</h1>
                                <h1 className='text-white mt-3'>21</h1>
                            </div>
                            <div className='text-center px-8 '>
                                <h1>Loses</h1>
                                <h1 className='text-white mt-3'>7</h1>
                            </div>
                        </div>
                        <div className='text-center pl-5'>
                            <button className='rounded-[20px] bg-[#5B8CD4] px-5 py-2 2xl:text-4xl lg:text-lg  text-sm'>Edit Profile</button>
                        </div>
                    </div>
                </div>
            </div>
            <div className=' h-[40%] xl:ml-96 lg:ml-72 md:mx-4 max-w-[2000px] min-[3200px]:m-auto 2xl:text-4xl lg:text-2xl'>
                <div className="flex flex-col md:flex-row gap-5  flex-auto h-[70%] p-5 ">
                    <div className='flex-1  mt-10'>
                        <h1>Match History</h1>
                        <div className='bg-[#D9D9D9] h-[500px] mt-5 p-5 overflow-y-auto  rounded-3xl'>
                        </div>
                    </div>
                    <div  className=' flex-1 mt-10'>
                        <h1>
                            Achievements
                        </h1>
                        <div className='bg-[#D9D9D9] h-[500px] mt-5 p-5 overflow-y-auto  rounded-3xl'></div>
                    </div>
                </div>
            </div>
        </div>
    </AuthCheck>
    );
}
export default Profile;