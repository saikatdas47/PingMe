import React, { useState } from "react";
import assets from "../assets/assets";

const LoginPage = () => {
  const [currentState, setCurrentState] = useState("Sign Up");

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [bio, setBio] = useState(''); 
  const [password, setPassword] = useState('');
  const [isDataSubmitted, setIsDataSubmitted] = useState(false);

  const onSubmitHandler = (event) => {
    event.preventDefault();
    
    if (currentState === "Sign Up" && !isDataSubmitted) {
      // Move to Step 2 (Bio)
      setIsDataSubmitted(true);
    } else {
      // Final Submit (Login or Step 2 Finish)
      console.log("Final Submission:", { fullName, bio, email, password });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[url('/background_path')] bg-no-repeat bg-cover bg-center">
      <div className="absolute inset-0 bg-[#12141e]/90"></div>

      <form onSubmit={onSubmitHandler} className="relative z-10 bg-white/5 backdrop-blur-xl p-10 rounded-3xl shadow-2xl border border-white/10 w-full max-w-md mx-4">
        
        {/* Back Button - Only shows on Step 2 of Sign Up */}
        {currentState === "Sign Up" && isDataSubmitted && (
          <img 
            src={assets.arrow_icon} 
            alt="back" 
            onClick={() => setIsDataSubmitted(false)}
            className="absolute top-10 left-8 w-4 cursor-pointer hover:scale-110 transition-transform rotate-180" 
          />
        )}

        <div className="flex flex-col items-center gap-4 mb-8">
          <img src={assets.logo} alt="Logo" className="w-11" />
          <h2 className="text-white text-3xl font-semibold tracking-tight">
            {currentState}
          </h2>
          {currentState === "Sign Up" && (
            <p className="text-gray-400 text-xs">
              {isDataSubmitted ? "Step 2: Tell us about yourself" : "Step 1: Create your account"}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-4">
          {/* STEP 1: Basic Info (Sign Up Only) */}
          {currentState === "Sign Up" && !isDataSubmitted && (
            <>
              <input
                onChange={(e) => setFullName(e.target.value)}
                value={fullName}
                type="text"
                placeholder="Username"
                className="bg-[#1a1c2e] text-white border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-[#a156ff] transition-all"
                required
              />
            </>
          )}

          {/* STEP 2: Bio Info (Sign Up Only) */}
          {currentState === "Sign Up" && isDataSubmitted && (
            <textarea
              onChange={(e) => setBio(e.target.value)}
              value={bio}
              placeholder="Write a short bio..."
              className="bg-[#1a1c2e] text-white border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-[#a156ff] transition-all resize-none h-32"
              required
            />
          )}

          {/* SHARED FIELDS (Email & Password) - Hidden during Step 2 to focus on Bio */}
          {!isDataSubmitted && (
            <>
              <input
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                type="email"
                placeholder="Email address"
                className="bg-[#1a1c2e] text-white border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-[#a156ff] transition-all"
                required
              />
              <input
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                type="password"
                placeholder="Password"
                className="bg-[#1a1c2e] text-white border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-[#a156ff] transition-all"
                required
              />
            </>
          )}
        </div>

        <button
          type="submit"
          className="w-full mt-6 bg-gradient-to-r from-[#077eff] to-[#a156ff] text-white py-3 rounded-xl font-medium shadow-lg hover:brightness-110 hover:scale-[1.02] transition-all active:scale-95"
        >
          {currentState === "Login" 
            ? "Login Now" 
            : (isDataSubmitted ? "Create Account" : "Next Step")}
        </button>

        <div className="mt-6 flex flex-col gap-3 text-center">
          {!isDataSubmitted && (
            <>
              <div className="flex items-center gap-2 text-xs text-gray-400">
                <input type="checkbox" className="accent-[#a156ff]" id="terms" required />
                <label htmlFor="terms">Agree to terms of use & privacy policy.</label>
              </div>

              <div className="text-sm text-gray-300">
                {currentState === "Sign Up" ? (
                  <p>Already have an account? <span onClick={() => setCurrentState("Login")} className="text-[#077eff] cursor-pointer font-medium hover:underline">Login here</span></p>
                ) : (
                  <p>Don't have an account? <span onClick={() => setCurrentState("Sign Up")} className="text-[#077eff] cursor-pointer font-medium hover:underline">Click here</span></p>
                )}
              </div>
            </>
          )}

          {currentState === "Login" && (
            <p className="text-xs text-gray-500 cursor-pointer hover:text-white transition-colors">
              Forgot Password?
            </p>
          )}
        </div>
      </form>
    </div>
  );
};

export default LoginPage;