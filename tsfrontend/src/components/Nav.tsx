import { Link , useNavigate} from 'react-router-dom'
import { useContext } from 'react';
import { context } from './Context';
import axios from 'axios';
const Nav = () => {
    const navigate=useNavigate();
    const value=useContext(context);
  return (
    <div className='flex justify-between mx-10 mt-5 bg-violet-400 py-3 rounded-xl'>
        <div>
            <Link to="/" className='ml-5 font-semibold underline text-red-600'>INTERACTIVE-TEST</Link>
        </div>
        <div className='mr-5'>
            <button  className='underline'
                onClick={async(event)=>{
                    event.preventDefault();
                    if(value&&value.loggedIn){
                        const res=await axios.get("http://localhost:3000/logout",{withCredentials:true});
                        console.log(res.data.message);
                    }
                    navigate("/loginReg")
                }}
            >{value&&value.loggedIn?"LOGOUT":"Login/Register"}</button>
        </div>
    </div>
  )
}

export default Nav