import React from 'react'

const HistoryMatches = ({playerOne, resultOne, playerTwo, resultTwo, duration, date, totalMatches}) => {
  return (
    <div className="history-results mt-[20px]  w-full h-[40px] bg-[#79a9f28d] shadow-lg rounded-[40px] flex  justify-between   px-1 py-1 hover:bg-[#95c0ff8d]">

        <div className='res w-[23%]  text-center flex justify-between'>
          <img src={playerOne} alt="" className='rounded-full' />
          <h1>{resultOne} - {resultTwo}</h1>
          <img src={playerTwo} alt="" className='rounded-full'/>
        </div>

        <div className='res w-[23%]  text-center'>
          <h1>{duration}</h1>
        </div>

        <div className='res w-[23%]  text-center'>
          <h1>{date}</h1>
        </div>

        <div className='res w-[23%]  text-center'>
          <h1>{totalMatches}</h1>
        </div>

    </div>
  )
}

export default HistoryMatches