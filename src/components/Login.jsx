import React from 'react'
import { useAppContext } from '../context/AppContext';
import toast from 'react-hot-toast';

const Login = () => {

    const {setShowLogin, axios, setToken, navigate} = useAppContext()

    const [state, setState] = React.useState("login");
    const [name, setName] = React.useState("");
    const [email, setEmail] = React.useState("");
    const [phone, setPhone] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [otp, setOtp] = React.useState("");
    const [isOtpSent, setIsOtpSent] = React.useState(false);
    const [agreeTerms, setAgreeTerms] = React.useState(false);
    const [signupOtp, setSignupOtp] = React.useState("");
    const [isSignupOtpSent, setIsSignupOtpSent] = React.useState(false);

    const sendSignupOtp = async () => {
        if (!phone) {
            toast.error("Please enter phone number first");
            return;
        }
        try {
            const { data } = await axios.post('/api/user/send-otp', { phone, isSignup: true });
            if (data.success) {
                toast.success("OTP sent to your WhatsApp");
                setIsSignupOtpSent(true);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    };

    const onSubmitHandler = async (event)=>{
        event.preventDefault();
        try {
            if (state === 'register' && !agreeTerms) {
                toast.error("Please agree to terms and conditions");
                return;
            }
            if (state === 'register' && !isSignupOtpSent) {
                toast.error("Please verify your phone number with OTP");
                return;
            }
            if (state === 'login-otp') {
                if (!isOtpSent) {
                    // Send OTP
                    const { data } = await axios.post('/api/user/send-otp', { phone });
                    if (data.success) {
                        toast.success(data.message);
                        setIsOtpSent(true);
                        // For demo purposes, we might want to log the OTP if returned (but it shouldn't be in prod)
                        if(data.otp) console.log("OTP:", data.otp); 
                    } else {
                        toast.error(data.message);
                    }
                } else {
                    // Verify OTP and Login
                    const { data } = await axios.post('/api/user/login-otp', { phone, otp });
                    if (data.success) {
                        navigate('/');
                        setToken(data.token);
                        localStorage.setItem('token', data.token);
                        setShowLogin(false);
                    } else {
                        toast.error(data.message);
                    }
                }
                return;
            }

            const {data} = await axios.post(`/api/user/${state}`, {name, email, password, phone, otp: signupOtp})

            if (data.success) {
                navigate('/')
                setToken(data.token)
                localStorage.setItem('token', data.token)
                setShowLogin(false)
            }else{
                toast.error(data.message)
            }

        } catch (error) {
            toast.error(error.message)
        }
        
    }

  return (
    <div onClick={()=> setShowLogin(false)} className='fixed top-0 bottom-0 left-0 right-0 z-100 flex items-center text-sm text-gray-600 bg-black/50'>

      <form onSubmit={onSubmitHandler} onClick={(e)=>e.stopPropagation()} className="flex flex-col gap-4 m-auto items-start p-8 py-12 w-80 sm:w-[352px] rounded-lg shadow-xl border border-gray-200 bg-white">
            <p className="text-2xl font-medium m-auto">
                <span className="text-primary">User</span> {state === "login" ? "Login" : state === "register" ? "Sign Up" : "OTP Login"}
            </p>
            {state === "register" && (
                <div className="w-full">
                    <p>Name</p>
                    <input onChange={(e) => setName(e.target.value)} value={name} placeholder="type here" className="border border-gray-200 rounded w-full p-2 mt-1 outline-primary" type="text" required />
                </div>
            )}
            {state === "register" && (
                <div className="w-full">
                    <p>Phone</p>
                    <div className="flex gap-2">
                        <input onChange={(e) => setPhone(e.target.value)} value={phone} placeholder="type here" className="border border-gray-200 rounded w-full p-2 mt-1 outline-primary" type="text" required disabled={isSignupOtpSent} />
                        <button type="button" onClick={sendSignupOtp} className="mt-1 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded text-xs whitespace-nowrap" disabled={isSignupOtpSent}>
                            {isSignupOtpSent ? "Sent" : "Send OTP"}
                        </button>
                    </div>
                    {isSignupOtpSent && (
                        <div className="mt-2">
                            <p>OTP</p>
                            <input onChange={(e) => setSignupOtp(e.target.value)} value={signupOtp} placeholder="Enter OTP" className="border border-gray-200 rounded w-full p-2 mt-1 outline-primary" type="text" required />
                        </div>
                    )}
                </div>
            )}
            
            {state === "login-otp" ? (
                <div className="w-full">
                    <p>Phone</p>
                    <input onChange={(e) => setPhone(e.target.value)} value={phone} placeholder="Enter phone number" className="border border-gray-200 rounded w-full p-2 mt-1 outline-primary" type="text" required disabled={isOtpSent} />
                    {isOtpSent && (
                        <div className="mt-4">
                            <p>OTP</p>
                            <input onChange={(e) => setOtp(e.target.value)} value={otp} placeholder="Enter OTP sent to WhatsApp" className="border border-gray-200 rounded w-full p-2 mt-1 outline-primary" type="text" required />
                        </div>
                    )}
                </div>
            ) : (
                <>
                    <div className="w-full ">
                        <p>Email</p>
                        <input onChange={(e) => setEmail(e.target.value)} value={email} placeholder="type here" className="border border-gray-200 rounded w-full p-2 mt-1 outline-primary" type="email" required />
                    </div>
                    <div className="w-full ">
                        <p>Password</p>
                        <input onChange={(e) => setPassword(e.target.value)} value={password} placeholder="type here" className="border border-gray-200 rounded w-full p-2 mt-1 outline-primary" type="password" required />
                    </div>
                </>
            )}

            {state === "register" ? (
                <div className="flex flex-col gap-2">
                    <label className="flex items-start gap-2 text-xs">
                        <input 
                            type="checkbox" 
                            checked={agreeTerms} 
                            onChange={(e) => setAgreeTerms(e.target.checked)}
                            className="mt-0.5"
                        />
                        <span>I agree to the <a href="#" className="text-primary underline">Terms and Conditions</a> and <a href="#" className="text-primary underline">Privacy Policy</a></span>
                    </label>
                    <p>
                        Already have account? <span onClick={() => setState("login")} className="text-primary cursor-pointer">click here</span>
                    </p>
                </div>
            ) : state === "login" ? (
                <div className="flex flex-col gap-1">
                    <p>
                        Create an account? <span onClick={() => setState("register")} className="text-primary cursor-pointer">click here</span>
                    </p>
                    <p>
                        Login with OTP? <span onClick={() => {setState("login-otp"); setIsOtpSent(false);}} className="text-primary cursor-pointer">click here</span>
                    </p>
                </div>
            ) : (
                <p>
                    Back to <span onClick={() => setState("login")} className="text-primary cursor-pointer">Login</span>
                </p>
            )}
            <button className="bg-primary hover:bg-blue-800 transition-all text-white w-full py-2 rounded-md cursor-pointer">
                {state === "register" ? "Create Account" : state === "login-otp" ? (isOtpSent ? "Verify & Login" : "Send OTP") : "Login"}
            </button>
        </form>
    </div>
  )
}

export default Login
