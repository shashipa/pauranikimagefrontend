// app/otp/page.jsx
"use client"
import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
export default function OtpPage({email,token}) {
const [otp,setOtp]=useState("")
const [message,setMessage]=useState("")
console.log(email)
const router=useRouter()
let URL="https://pauranikart.com/api/v1/"
async function  handleSubmit(e) {
    try{
    e.preventDefault()
    const data=await axios.post(`${URL}user/otp`,{email:email,otp:otp},{
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials:true
    })
   // console.log(data.data)
    if(data.data.success===true){
        router.push("/userprofile")
    }
    else {
        setMessage(data.data.message)
    }
}
catch(error){
    console.log(error)
}
    
}
return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 via-amber-100 to-yellow-50 relative overflow-hidden">
      {/* Subtle glowing background orbs */}
      <div className="pointer-events-none absolute -top-16 -left-20 w-[28rem] h-[28rem] rounded-full bg-orange-200/40 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-20 -right-24 w-[30rem] h-[30rem] rounded-full bg-yellow-300/30 blur-3xl" />

      {/* Card */}
      <div className="relative w-full max-w-md rounded-3xl border border-orange-200/70 bg-white/75 backdrop-blur-xl shadow-2xl p-8 sm:p-10">
        {/* Brand */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-500 text-white text-2xl shadow-md">
            🔱
          </div>
          <h1 className="mt-3 text-3xl font-bold tracking-wide text-orange-700">
            Pauranik Image
          </h1>
          <p className="mt-1 text-sm text-gray-600">
            Enter the 6-digit code we sent to your email
          </p>
          <p className="text-xs text-gray-500 mt-1">example@domain.com</p>
        </div>

        {/* OTP Inputs */}
        <form className="space-y-6" onSubmit={handleSubmit}>
         <div className="grid grid-cols-6 gap-3">
      <div className="w-full flex flex-col items-center justify-center">
      <input
        type="text"
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
        placeholder="Enter your OTP"
        className="w-full max-w-md h-14 rounded-2xl border border-orange-300/70 bg-white/90 text-center text-lg sm:text-xl text-gray-800 tracking-widest outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent shadow-sm placeholder-gray-400"
      />
    </div>
    </div>
   <span>{message}</span>
          <button
            type="submit"
            className="w-full py-3 sm:py-3.5 rounded-2xl font-semibold text-white text-base sm:text-lg bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 shadow-md transition"
          >
            Verify
          </button>
        </form>

        {/* Help / Actions */}
        <div className="mt-6 flex items-center justify-between text-xs sm:text-sm text-gray-600">
          <a href="/user" className="hover:text-orange-600 underline underline-offset-4">
            Change email
          </a>
          <div className="flex items-center gap-2">
            <span>Didn’t receive the code?</span>
            <span className="text-orange-600 font-medium">Resend</span>
          </div>
        </div>

        {/* Footer note */}
        <p className="mt-6 text-[11px] sm:text-xs text-gray-500 text-center">
          By continuing, you agree to our{" "}
          <a href="/terms" className="text-orange-600 hover:underline">Terms</a> &{" "}
          <a href="/privacy" className="text-orange-600 hover:underline">Privacy Policy</a>.
        </p>
      </div>
    </div>

  );
}
