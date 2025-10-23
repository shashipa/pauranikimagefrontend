"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

const URL = "https://pauranikart.com/api/v1/";

export default function LoginForm({ token }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (token) {
      router.replace("/userprofile");
    }
  }, [token, router]);

  async function handleSubmit(e) {
    e.preventDefault();

    if (!email.trim()) {
      setMessage("Please enter your email address.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const res = await axios.post(
        `${URL}user/login`,
        { email },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      if (res.data?.success === true) {
        router.push("/verifyOtp");
      } else {
        setMessage(res.data?.message || "Unable to send OTP.");
      }
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "Something went wrong. Please try again.";
      setMessage(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 via-amber-100 to-yellow-50 relative overflow-hidden">
      <div className="absolute w-96 h-96 bg-orange-200 rounded-full blur-3xl opacity-30 top-10 left-10"></div>
      <div className="absolute w-96 h-96 bg-yellow-300 rounded-full blur-3xl opacity-20 bottom-10 right-10"></div>

      <div className="relative bg-white/70 border border-orange-200 backdrop-blur-xl shadow-2xl rounded-3xl p-10 w-full max-w-md text-center transition transform hover:scale-[1.02]">
        <h1 className="text-4xl font-bold text-orange-700 mb-2 tracking-wide">
          🔱 Pauranik Image
        </h1>
        <p className="text-gray-600 mb-6 text-sm">
          Enter your email address to continue
        </p>

        {message && (
          <div className="mb-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-2">
            {message}
          </div>
        )}

        <form className="space-y-5" onSubmit={handleSubmit}>
          <div className="relative">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full px-5 py-3 bg-white/80 border border-orange-300 rounded-2xl text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent placeholder-gray-400 transition-all pr-10"
              required
            />
            <span className="absolute right-4 top-3 text-orange-500">✉️</span>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-2xl font-semibold text-lg text-white shadow-md bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 transition-all duration-200 disabled:opacity-60"
          >
            {loading ? "Sending..." : "Send OTP"}
          </button>
        </form>

        <div className="mt-6 text-xs text-gray-500">
          By continuing, you agree to our{" "}
          <a href="/privacy" className="text-orange-600 hover:underline font-medium">
            Privacy Policy
          </a>{" "}
          and{" "}
          <a href="/terms" className="text-orange-600 hover:underline font-medium">
            Terms of Service
          </a>
        </div>
      </div>
    </div>
  );
}
