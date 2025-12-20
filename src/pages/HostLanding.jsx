import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { assets } from '../assets/assets';
import toast from 'react-hot-toast';

const HostLanding = () => {
  const navigate = useNavigate();
  const { user, isOwner, axios, setIsOwner, setShowLogin } = useAppContext();

  const handleStartHosting = async () => {
    if (!user) {
      setShowLogin(true);
      return;
    }

    if (isOwner) {
      navigate('/owner');
      return;
    }

    try {
      const { data } = await axios.post('/api/owner/change-role');
      if (data.success) {
        setIsOwner(true);
        toast.success(data.message);
        navigate('/owner');
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative bg-gray-900 text-white py-20 px-6 md:px-16 lg:px-24 xl:px-32 overflow-hidden">
        <div className="relative z-10 max-w-3xl">
          <h1 
            className="text-4xl md:text-6xl font-bold mb-6 leading-tight"
          >
            Turn your vehicle into an earning machine.
          </h1>
          <p 
            className="text-xl text-gray-300 mb-8"
          >
            Join thousands of hosts who are earning extra income by sharing their vehicles. It's safe, simple, and secure.
          </p>
          <button 
            onClick={handleStartHosting}
            className="bg-primary hover:bg-primary-dull text-white px-8 py-4 rounded-lg text-lg font-semibold transition-all shadow-lg hover:shadow-xl"
          >
            Start Hosting Now
          </button>
        </div>
        
        {/* Background Decoration */}
        <div className="absolute top-0 right-0 w-1/2 h-full opacity-20 pointer-events-none">
            <img src={assets.banner_car_image} alt="Background" className="object-cover w-full h-full" />
        </div>
      </div>

      {/* Benefits Section */}
      <div className="py-20 px-6 md:px-16 lg:px-24 xl:px-32">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Why host on our platform?</h2>
          <p className="text-gray-500 max-w-2xl mx-auto">We provide the tools, insurance, and support you need to build a thriving vehicle sharing business.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Benefit 1 */}
          <div className="flex flex-col items-center text-center p-6 rounded-xl hover:shadow-lg transition-shadow border border-transparent hover:border-gray-100">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-6 text-primary">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-3">Earn Extra Income</h3>
            <p className="text-gray-500">Offset the cost of ownership or build a business. You decide how much you want to earn.</p>
          </div>

          {/* Benefit 2 */}
          <div className="flex flex-col items-center text-center p-6 rounded-xl hover:shadow-lg transition-shadow border border-transparent hover:border-gray-100">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6 text-green-600">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043-3.296 3.746 3.746 0 0 1 3.296-1.043A3.746 3.746 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 0 1 3.296 1.043 3.746 3.746 0 0 1 1.043 3.296A3.745 3.745 0 0 1 21 12Z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-3">You're Covered</h3>
            <p className="text-gray-500">Rest easy with our comprehensive insurance coverage and 24/7 roadside assistance for every trip.</p>
          </div>

          {/* Benefit 3 */}
          <div className="flex flex-col items-center text-center p-6 rounded-xl hover:shadow-lg transition-shadow border border-transparent hover:border-gray-100">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-6 text-purple-600">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-3">Flexible Schedule</h3>
            <p className="text-gray-500">You're in control. Set your own availability, prices, and rules for your vehicle.</p>
          </div>
        </div>
      </div>

      {/* How it works */}
      <div className="bg-gray-50 py-20 px-6 md:px-16 lg:px-24 xl:px-32">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">How it works</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-sm">
                <span className="text-5xl font-bold text-gray-200 mb-4 block">01</span>
                <h3 className="text-xl font-bold mb-2">List your vehicle</h3>
                <p className="text-gray-500">Create a listing for free. Describe your car, set the price and availability.</p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-sm">
                <span className="text-5xl font-bold text-gray-200 mb-4 block">02</span>
                <h3 className="text-xl font-bold mb-2">Respond to requests</h3>
                <p className="text-gray-500">Guests will request to book your car. Accept the ones that work for you.</p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-sm">
                <span className="text-5xl font-bold text-gray-200 mb-4 block">03</span>
                <h3 className="text-xl font-bold mb-2">Earn money</h3>
                <p className="text-gray-500">Get paid securely via direct deposit after each successful trip.</p>
            </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20 px-6 text-center">
        <h2 className="text-3xl font-bold mb-6">Ready to get started?</h2>
        <button 
            onClick={handleStartHosting}
            className="bg-primary hover:bg-primary-dull text-white px-10 py-4 rounded-lg text-lg font-semibold transition-all shadow-lg hover:shadow-xl"
        >
            Become a Host
        </button>
      </div>
    </div>
  );
};

export default HostLanding;
