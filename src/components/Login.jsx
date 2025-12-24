import React, { useState, useEffect } from 'react'
import { useAppContext } from '../context/AppContext';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';
import { Phone, Shield, User, Mail, Lock, ArrowRight, Loader2 } from 'lucide-react';

const Login = () => {

    const {setShowLogin, axios, setToken, navigate} = useAppContext()

    const [step, setStep] = useState('phone'); // phone, otp, register
    const [isLogin, setIsLogin] = useState(true); // true = login, false = register
    
    // Form fields
    const [phone, setPhone] = useState("");
    const [otp, setOtp] = useState("");
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [agreeTerms, setAgreeTerms] = useState(false);
    
    // Loading and countdown
    const [loading, setLoading] = useState(false);
    const [countdown, setCountdown] = useState(0);

    // Countdown timer for resend OTP
    useEffect(() => {
        if (countdown > 0) {
            const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [countdown]);

    // Check if phone is registered
    const checkPhone = async () => {
        try {
            const { data } = await axios.post('/api/user/check-phone', { phone });
            return data.exists;
        } catch {
            return false;
        }
    };

    // Send OTP
    const handleSendOTP = async (e) => {
        e.preventDefault();
        
        if (phone.length !== 10) {
            return toast.error('Please enter a valid 10-digit phone number');
        }

        setLoading(true);
        try {
            // Check if phone exists
            const phoneExists = await checkPhone();
            
            if (isLogin && !phoneExists) {
                setLoading(false);
                return toast.error('Phone number not registered. Please sign up first.');
            }
            
            if (!isLogin && phoneExists) {
                setLoading(false);
                return toast.error('Phone number already registered. Please login.');
            }

            // Send OTP
            const { data } = await axios.post('/api/user/send-otp', { phone });
            
            if (data.success) {
                setStep('otp');
                setCountdown(60);
                toast.success('OTP sent successfully!');
            } else {
                toast.error(data.message || 'Failed to send OTP');
            }
        } catch (error) {
            toast.error(error.message || 'Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    // Verify OTP for Login
    const handleVerifyOTPLogin = async (e) => {
        e.preventDefault();
        
        if (otp.length !== 6) {
            return toast.error('Please enter a valid 6-digit OTP');
        }

        setLoading(true);
        try {
            const { data } = await axios.post('/api/user/verify-otp-login', { phone, otp });
            
            if (data.success) {
                setToken(data.token);
                localStorage.setItem('token', data.token);
                setShowLogin(false);
                navigate('/');
                toast.success('Login successful!');
            } else {
                toast.error(data.message || 'Invalid OTP');
            }
        } catch (error) {
            toast.error(error.message || 'Verification failed');
        } finally {
            setLoading(false);
        }
    };

    // Verify OTP and move to register form
    const handleVerifyOTPForRegister = async (e) => {
        e.preventDefault();
        
        if (otp.length !== 6) {
            return toast.error('Please enter a valid 6-digit OTP');
        }

        // For registration, first verify OTP is valid format, then show register form
        setStep('register');
    };

    // Complete Registration
    const handleRegister = async (e) => {
        e.preventDefault();
        
        if (!agreeTerms) {
            return toast.error('Please agree to terms and conditions');
        }

        if (password.length < 8) {
            return toast.error('Password must be at least 8 characters');
        }

        setLoading(true);
        try {
            const { data } = await axios.post('/api/user/verify-otp-register', {
                name,
                email,
                phone,
                password,
                otp
            });
            
            if (data.success) {
                setToken(data.token);
                localStorage.setItem('token', data.token);
                setShowLogin(false);
                navigate('/');
                toast.success('Registration successful!');
            } else {
                toast.error(data.message || 'Registration failed');
            }
        } catch (error) {
            toast.error(error.message || 'Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    // Resend OTP
    const handleResendOTP = async () => {
        if (countdown > 0) return;
        
        setLoading(true);
        try {
            const { data } = await axios.post('/api/user/send-otp', { phone });
            
            if (data.success) {
                setCountdown(60);
                toast.success('OTP resent successfully!');
            } else {
                toast.error(data.message || 'Failed to resend OTP');
            }
        } catch (error) {
            toast.error(error.message || 'Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    // Reset form
    const resetForm = () => {
        setStep('phone');
        setOtp('');
        setName('');
        setEmail('');
        setPassword('');
        setAgreeTerms(false);
    };

    // Switch between login and register
    const switchMode = () => {
        setIsLogin(!isLogin);
        resetForm();
    };

    return (
        <div onClick={() => setShowLogin(false)} className='fixed top-0 bottom-0 left-0 right-0 z-100 flex items-center text-sm text-gray-600 bg-black/50'>
            <div onClick={(e) => e.stopPropagation()} className="flex flex-col gap-4 m-auto items-start p-8 py-10 w-80 sm:w-[380px] rounded-xl shadow-xl border border-gray-200 bg-white">
                
                {/* Header */}
                <div className="w-full text-center mb-2">
                    <p className="text-2xl font-semibold">
                        <span className="text-primary">
                            {step === 'phone' && (isLogin ? 'Login' : 'Sign Up')}
                            {step === 'otp' && 'Verify OTP'}
                            {step === 'register' && 'Complete Registration'}
                        </span>
                    </p>
                    <p className="text-gray-400 text-sm mt-1">
                        {step === 'phone' && 'Enter your phone number to continue'}
                        {step === 'otp' && `Enter OTP sent to +91 ${phone}`}
                        {step === 'register' && 'Fill in your details to create account'}
                    </p>
                </div>

                {/* Phone Step */}
                {step === 'phone' && (
                    <form onSubmit={handleSendOTP} className="w-full space-y-4">
                        <div className="w-full">
                            <label className="text-sm font-medium text-gray-700 mb-1 block">Phone Number</label>
                            <div className="flex">
                                <span className="inline-flex items-center px-3 bg-gray-100 border border-r-0 border-gray-300 rounded-l-lg text-gray-600 text-sm">
                                    +91
                                </span>
                                <div className="relative flex-1">
                                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                    <input
                                        type="tel"
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                                        placeholder="Enter 10-digit number"
                                        className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-r-lg outline-primary"
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading || phone.length !== 10}
                            className="w-full py-2.5 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <Loader2 className="animate-spin" size={20} />
                            ) : (
                                <>
                                    Send OTP <ArrowRight size={18} />
                                </>
                            )}
                        </button>

                        <p className="text-center text-sm">
                            {isLogin ? "Don't have an account?" : "Already have an account?"}{' '}
                            <span onClick={switchMode} className="text-primary cursor-pointer hover:underline">
                                {isLogin ? 'Sign Up' : 'Login'}
                            </span>
                        </p>
                    </form>
                )}

                {/* OTP Step */}
                {step === 'otp' && (
                    <form onSubmit={isLogin ? handleVerifyOTPLogin : handleVerifyOTPForRegister} className="w-full space-y-4">
                        <div className="w-full">
                            <label className="text-sm font-medium text-gray-700 mb-1 block">Enter OTP</label>
                            <div className="relative">
                                <Shield className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                <input
                                    type="text"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                    placeholder="Enter 6-digit OTP"
                                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg outline-primary text-center text-lg tracking-widest"
                                    required
                                />
                            </div>
                        </div>

                        <div className="flex items-center justify-between text-sm">
                            <button
                                type="button"
                                onClick={() => setStep('phone')}
                                className="text-primary hover:underline"
                            >
                                Change Number
                            </button>
                            <button
                                type="button"
                                onClick={handleResendOTP}
                                disabled={countdown > 0 || loading}
                                className="text-primary hover:underline disabled:text-gray-400 disabled:no-underline"
                            >
                                {countdown > 0 ? `Resend in ${countdown}s` : 'Resend OTP'}
                            </button>
                        </div>

                        <button
                            type="submit"
                            disabled={loading || otp.length !== 6}
                            className="w-full py-2.5 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <Loader2 className="animate-spin" size={20} />
                            ) : (
                                <>
                                    {isLogin ? 'Login' : 'Verify & Continue'} <ArrowRight size={18} />
                                </>
                            )}
                        </button>
                    </form>
                )}

                {/* Register Step */}
                {step === 'register' && (
                    <form onSubmit={handleRegister} className="w-full space-y-3">
                        <div className="w-full">
                            <label className="text-sm font-medium text-gray-700 mb-1 block">Full Name</label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Enter your name"
                                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg outline-primary"
                                    required
                                />
                            </div>
                        </div>

                        <div className="w-full">
                            <label className="text-sm font-medium text-gray-700 mb-1 block">Email</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Enter your email"
                                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg outline-primary"
                                    required
                                />
                            </div>
                        </div>

                        <div className="w-full">
                            <label className="text-sm font-medium text-gray-700 mb-1 block">Password</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Create a password"
                                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg outline-primary"
                                    required
                                />
                            </div>
                            <p className="text-xs text-gray-400 mt-1">Password must be at least 8 characters</p>
                        </div>

                        <div className="w-full">
                            <label className="flex items-start gap-2 text-xs">
                                <input
                                    type="checkbox"
                                    checked={agreeTerms}
                                    onChange={(e) => setAgreeTerms(e.target.checked)}
                                    className="mt-0.5"
                                />
                                <span>
                                    I agree to the{' '}
                                    <Link to="/terms" onClick={() => setShowLogin(false)} className="text-primary underline">
                                        Terms and Conditions
                                    </Link>{' '}
                                    and{' '}
                                    <Link to="/privacy" onClick={() => setShowLogin(false)} className="text-primary underline">
                                        Privacy Policy
                                    </Link>
                                </span>
                            </label>
                        </div>

                        <button
                            type="submit"
                            disabled={loading || !agreeTerms}
                            className="w-full py-2.5 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <Loader2 className="animate-spin" size={20} />
                            ) : (
                                <>
                                    Create Account <ArrowRight size={18} />
                                </>
                            )}
                        </button>

                        <button
                            type="button"
                            onClick={() => setStep('otp')}
                            className="w-full text-sm text-gray-500 hover:text-primary"
                        >
                            ← Back to OTP
                        </button>
                    </form>
                )}
            </div>
        </div>
    )
}

export default Login
