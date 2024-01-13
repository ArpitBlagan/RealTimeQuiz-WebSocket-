import React, {useState} from 'react'
import axios from 'axios'
import PopUp from './PopUp'
import { error } from './LogInReg'
interface question{
    title:string;
    options:string[];
    rightAns:string;
}
const Quizform = () => {
    const[questions,setQ]=useState<question[]>([]);
    const [req,setRer]=useState<error>({reqError:false,errorText:""});
    const handleAdd=(event:React.MouseEvent<HTMLButtonElement>)=>{
        event.preventDefault();
        setQ((prev)=>{
            return [
                ...prev,{title:"",options:["","","",""],rightAns:""}
            ]
        });
    }
    const handleIo=(event:React.ChangeEvent<HTMLInputElement>,index:number,ind:number)=>{
        setQ((prev)=>{
            return prev.map((ele,inde)=>{
                if(inde==index){
                    return {
                        ...ele,options:ele.options.map((el,inn)=>{
                            if(inn==ind){
                                return event.target.value;
                            }
                            else{return el;}
                        })
                    }
                } 
                else{return ele;}
            })
        });console.log(questions);
    }
    const handleR=(event:React.ChangeEvent<HTMLInputElement>,index:number)=>{
        setQ((prev)=>{
            return prev.map((ele,ind)=>{
                if(ind==index){
                    return {
                        ...ele,
                        rightAns:event.target.value
                    } 
                }
                else{return ele;}
            })    
        })
    }
    const handleT=(event:React.ChangeEvent<HTMLInputElement>,index:number)=>{
        setQ((prev)=>{
            return prev.map((ele,ind)=>{
                if(ind==index){
                    return {
                        ...ele,
                        title:event.target.value
                    } 
                }
                else{return ele;}
            })    
        })
    }
    const handleDel=(event:React.MouseEvent<HTMLButtonElement>,index:number)=>{
        event.preventDefault();
        const val=[...questions];
        val.splice(index,1);
        setQ(val);
    }
    const handleSubmit=async(event:React.MouseEvent<HTMLButtonElement>)=>{
        event.preventDefault();
        if(questions.length==0){
            setRer((prev)=>{
                return {
                    ...prev,
                    reqError:true,
                    errorText:"Please add atleast one question before submitting"
                }
            });
            return ;
        }
        const body={questions}
        const res=await axios.post('http://localhost:3000/addQuiz',body,{withCredentials:true});
        console.log(res);
        if(res.data.message=="created"){
            setRer((prev)=>{
                return {
                    ...prev,
                    reqError:true,
                    errorText:"Quiz created successfully"
                }
            });
            setQ([]);
        }
        else if(res.data=='Authorization error'){
            setRer((prev)=>{
                return {
                    ...prev,
                    reqError:true,
                    errorText:"Login Required again."
                }
            });
        }
        else{
            setRer((prev)=>{
                return {
                    ...prev,
                    reqError:true,
                    errorText:"Something went wrong please try again later."
                }
            });
        }
    }
  return (
    <div className='flex flex-col justify-center items-center'>
        {req.reqError&&<div className={`fixed w-full h-full top-0 left-0`}><PopUp change={setRer} text={req.errorText}/></div>}
        <h1>Create Your own Quiz</h1>
        <p>Add questions and submit the Form</p>
        <div className='border-[2px] border-gray-300  w-full'>
            <h1 className='text-center text-[30px] underline text-red-400'>Questions</h1>
            {questions.map((ele,index)=>{
                return <div key={index} className='mx-2'>
                    <div className='flex justify-between mt-2'>
                        <h1 className='text'>Question: {index+1}</h1> 
                        <button className='py-1 px-2 bg-red-400 rounded-xl'
                            onClick={(e)=>{handleDel(e,index)}}
                        >Delete</button>
                    </div>
                    <div className='flex flex-col  justify-around gap-2'>
                        <div >
                            <h1>Statement</h1>
                            <input className='w-full  border-[2px] border-gray-300 h-[50px] rounded pl-2'
                                placeholder='Enter Question Statement..' value={ele.title}
                                onChange={(e)=>{handleT(e,index)}}
                            />
                        </div>
                        <div>
                            <h1>Right option</h1>
                            <input value={ele.rightAns} className=' w-full border-[2px] h-[40px] border-gray-300 pl-2' 
                                placeholder='enter the right ans' onChange={(e)=>{handleR(e,index)}}
                            />
                        </div>
                    </div>
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-2 mx-2'>
                        {ele.options.map((ee,ind)=>{
                            return <div className='flex flex-col justify-center' key={ind}>
                                <h1>option. {ind+1}</h1>
                                <input value={ee} className='border-[2px] border-gray-300 h-[40px] pl-2'
                                    onChange={(e)=>{handleIo(e,index,ind)}}
                                />
                            </div>
                        })}
                    </div>
                </div>
            })}
            <div className=''>
                <button className='m-2 px-1 py-2 rounded-xl bg-violet-400' onClick={handleAdd}>Add Question</button>
            </div>
        </div>
        <button className='my-2 px-2 py-4 rounded-xl bg-red-400'
            onClick={handleSubmit}
        >Submit Form</button>
    </div>
  )
}

export default Quizform