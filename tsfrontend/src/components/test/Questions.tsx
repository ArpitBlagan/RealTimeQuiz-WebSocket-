import React,{useEffect, useState} from 'react'
import { statementt } from '../Test'
interface Props{
    statement:statementt;
    socket:WebSocket;
    keyy:string;
}

const Questions:React.FC<Props>= (props) => {
    const [count,setCount]=useState<number>(15);
    const [done,setD]=useState<boolean>(false);
    useEffect(()=>{
        if(count==0){
            return;
        }
        const x=setInterval(()=>{
            setCount((prev)=>prev-1);
        },1000);
        return ()=>clearInterval(x);
    },[count]);
  return (
    <div className='border-[2px] broder-red-400 px-10 py-2 my-4 w-full'>
        {done?<div>
            <h1 className='text-[20px] text-red-400'>Response is responded wait for others to complete</h1>
        </div>:<div className='flex flex-col  justify-around gap-2 mb-3'>
            <h1 className='text-center text-[20px]'>Choose the Correct Option and It will get save as the counter reached 0</h1>
            <div className='py-3'>
                <div className='text-[20px] flex justify-between'>
                    <h1>Statement</h1>
                    <h1>{count}</h1>
                </div>
                <p>{props.statement.title}</p>
            </div>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-2'>
                {props.statement.options.map((ele,index)=>{
                    return <div key={index}>
                        <input type="radio" value={ele} onChange={(e)=>{
                            const val=JSON.stringify({
                                name:"userAns",
                                ans:e.target.value,
                                time:count,
                                id:props.keyy
                            });
                            props.socket.send(val);setD(true);
                        }}/>
                        <p>{index+1}. {ele}</p>
                    </div>
                })}
            </div>
        </div>}
    </div>
  )
}

export default Questions