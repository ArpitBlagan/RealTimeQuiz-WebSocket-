import { error } from "./LogInReg";
interface propss{
    change:any;
    text:string
}
const PopUp = ({change,text}:propss) => {
  return (
    <div className='absoulte z-99 h-full w-full backdrop-blur-md  top-0 left-0 flex justify-center items-center'>
        <div className='rounded-xl bg-gray-200 h-[200px] flex flex-col p-3 justify-center items-center'>
            <p className="text-red-500">{text}</p>
            <button className="bg-violet-400 px-5 py-2 rounded-lg"
                onClick={(e)=>{
                    e.preventDefault();
                    change((prev:error)=>{
                        return {...prev,reqError:false};
                    });
                }}
            >OKAY</button>
        </div>
    </div>
  )
}
export default PopUp