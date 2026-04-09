import {useState} from 'react'
import { loginUser } from '../api/authApi.js';
import { useDispatch } from 'react-redux';
import { setCredentials } from '../Redux/features/auth/authSlice.js';
import { useNavigate } from 'react-router-dom';
function LoginPage() {
   
    const dispatch = useDispatch();
    const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    try{
        const res = await loginUser({
            username,
            password,
        });
        if(res.data && res.data.token){
        dispatch(setCredentials({
         user: res.data.user,
         token: res.data.token
            }));

        const role = res.data.user.role.toLowerCase();
        //3. Role-based Redirection

        if(role === "admin"){
            navigate("/admin");
        }else if(role === "staff"){
            navigate("/medicines");
        }
    
        }else{
            throw new Error("Invalid response structure from srver");
        }
    } catch(err){
        console.log(err);
        alert(err.response?.data?.message  || "Login Failed ❌");
    }
  } 
    return (
    
    <div className= "min-h-screen flex items-center justify-center bg-[linear-gradient(145deg,#d0f0ea,#f0f9fc)] font-['Segoe_UI',Tahoma,Geneva,Verdana,sans-serif]">
        <form className="bg-white/65 backdrop-blur-[12px] rounded-[20px] w-[380px] max-w-[90%] p-[45px_35px] flex flex-col gap-[25px] shadow-[0_20px_40px_rgba(0,0,0,0.1),0_0_0_1px_rgba(255,255,255,0.2)] transition-all duration-300 hover:-translate-y-[6px] hover:shadow-[0_25px_50px_rgba(0,0,0,0.12),0_0_0_1px_rgba(255,255,255,0.2)]" onSubmit={handleLogin}>


            <h2 className='text-center text-[30px] font-bold text-[#00695c] tracking-[0.5px] mb-[15px]'>Login</h2>
            <input className="w-full p-[14px_18px] rounded-[12px] border border-black/10 bg-white/80 text-[16px] text-[#004d40] transition-all duration-300 placeholder:text-[#6c757d] focus:outline-none focus:border-[1.5px] focus:border-[#00897b] focus:shadow-[0_0_10px_rgba(0,137,123,0.2)]" type="text" 
            placeholder='Enter Username' 
            value={username}
            onChange={(e) => setUsername (e.target.value)}
            required
            />
            <input
            className='w-full p-[14px_18px] rounded-[12px] border border-black/10 bg-white/80 text-[16px] text-[#004d40] transition-all duration-300 placeholder:text-[#6c757d] focus:outline-none focus:border-[1.5px] focus:border-[#00897b] focus:shadow-[0_0_10px_rgba(0,137,123,0.2)]'
            type='password'
            placeholder='Enter Password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required/>

            <button className='w-full py-[14px] rounded-[12px] text-[16px] font-semibold text-white bg-[linear-gradient(135deg,#00bfa5,#00897b)] cursor-pointer transition-all duration-300 shadow-[0_6px_18px_rgba(0,0,0,0.1)] hover:bg-[linear-gradient(135deg,#00897b,#00695c)] hover:-translate-y-[3px] hover:shadow-[0_8px_20px_rgba(0,0,0,0.15)]' type='submit'>Login</button>
        </form>
    </div>
  )
}

export default LoginPage