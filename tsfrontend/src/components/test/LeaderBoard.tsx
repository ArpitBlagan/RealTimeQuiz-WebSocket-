import React from 'react'
import { scoree  } from '../Test'
interface Props{
    score:scoree[]
}
const LeaderBoard:React.FC<Props> = ({score}) => {
  return (
    <div className='overflow-auto-y w-full border-[2px] broder-red-400 px-10 py-2 my-4 '>
        <div className='flex justify-around border-[2px] my-2' >
                    <h1>Position.</h1>
                    <h1>Name</h1>
                    <h1>Total Points</h1>
                </div>
        {score.map((ele,index)=>{
            return <div className='flex justify-around border-[2px] my-2' key={index}>
                    <h1>{index+1}.</h1>
                    <h1>{ele.name}</h1>
                    <h1>{ele.score}</h1>
                </div>
        })}
    </div>
  )
}

export default LeaderBoard