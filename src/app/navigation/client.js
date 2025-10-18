"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter,redirect } from "next/navigation";
export default  function DevotionalNavbar({token}) {
  const router=useRouter()
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [tokendata,setToken]=useState("")
  async function logoutuser() {
    const url="http://localhost:7001/api/v1/user/logout"
    const data=await axios.get(url,{withCredentials:true})
    console.log(data.data.success)
   if(data.data.success==true){
redirect("/")
   }
  }
  console.log(token+"from nav")
  useEffect(() => {
    setToken(token)
    const onScroll = () => setScrolled(window.scrollY > 6);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, [token]);
  return (
    <header
      className={`sticky top-0 z-50 transition-all ${
        scrolled ? "backdrop-blur bg-white/70 dark:bg-neutral-900/70 shadow" : "bg-transparent"
      }`}
      aria-label="Pauranikart Navigation"
    >
      {/* saffron–gold halo */}
      <div className="h-0.5 bg-gradient-to-r from-amber-500 via-orange-500 to-yellow-500" />

      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* 3 columns: left links / center brand / right actions */}
        <div className="grid grid-cols-3 items-center py-3">
          {/* LEFT */}
          <div className="hidden md:flex items-center gap-6 text-sm">
            <NavLink href="/explore" label="Explore" />
            <NavLink href="/deities" label="Deities" />
            <NavLink href="/collections" label="Collections" />
            <NavLink href="/about" label="About" />
          </div>

          {/* CENTER brand */}
          <div className="justify-self-center">
            <Link href="/" className="group inline-flex items-center gap-2" aria-label="Pauranikart Home">
              {/* lotus icon */}
              <span
                aria-hidden
                className="relative inline-flex h-6 w-6 rounded-full bg-gradient-to-tr from-orange-500 to-amber-400 shadow-inner shadow-amber-700/20 ring-1 ring-amber-300/50"
              >
                <svg viewBox="0 0 64 64" className="absolute inset-0 m-auto h-4 w-4 text-white/90" fill="currentColor">
                  <path d="M32 6c2 7 4 10 11 14-6 1-9 2-11 7-2-5-5-6-11-7 7-4 9-7 11-14zm0 23c5-7 11-7 18-6-6 5-7 9-6 15-5-2-9-1-12 3-3-4-7-5-12-3 1-6 0-10-6-15 7-1 13-1 18 6zm-14 17c7-3 11-2 14 2 3-4 7-5 14-2-7 6-16 9-28 0z" />
                </svg>
              </span>
              <span className="text-xl font-semibold tracking-wide bg-clip-text text-transparent bg-gradient-to-r from-amber-700 via-orange-700 to-rose-700 dark:from-amber-200 dark:via-yellow-200 dark:to-orange-200">
                pauranikart
              </span>
              <span className="block h-0.5 w-0 bg-gradient-to-r from-amber-500 to-yellow-400 transition-all duration-300 group-hover:w-full" />
            </Link>
          </div>

          {/* RIGHT */}
          <div className="flex items-center justify-end gap-2">
            {/* mobile toggle */}
            <button
              className="md:hidden inline-flex items-center justify-center rounded-xl border border-amber-200/60 px-3 py-2 text-sm font-medium text-amber-700/90 dark:text-amber-200/90 bg-white/70 dark:bg-neutral-900/50 shadow-sm"
              aria-label="Toggle Menu"
              aria-expanded={open}
              onClick={() => setOpen(v => !v)}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" className="opacity-90">
                <path
                  d={open ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </button>

            {/* Sign in */}
           {tokendata?
           <button
              onClick={logoutuser}
              className="hidden md:inline-flex items-center gap-2 rounded-2xl px-4 py-2 text-sm font-semibold text-white
              bg-gradient-to-r from-orange-600 via-amber-600 to-yellow-600 shadow-[0_6px_18px_-6px_rgba(234,88,12,0.55)]
              hover:scale-[1.02] active:scale-[0.99] transition"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M15 3h4a2 2 0 012 2v14a2 2 0 01-2 2h-4" stroke="white" strokeWidth="2" />
                <path d="M10 17l5-5-5-5" stroke="white" strokeWidth="2" strokeLinecap="round" />
                <path d="M15 12H3" stroke="white" strokeWidth="2" strokeLinecap="round" />
              </svg>
              Log Out
            </button>:
            <Link
              href="/user"
              className="hidden md:inline-flex items-center gap-2 rounded-2xl px-4 py-2 text-sm font-semibold text-white
              bg-gradient-to-r from-orange-600 via-amber-600 to-yellow-600 shadow-[0_6px_18px_-6px_rgba(234,88,12,0.55)]
              hover:scale-[1.02] active:scale-[0.99] transition"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M15 3h4a2 2 0 012 2v14a2 2 0 01-2 2h-4" stroke="white" strokeWidth="2" />
                <path d="M10 17l5-5-5-5" stroke="white" strokeWidth="2" strokeLinecap="round" />
                <path d="M15 12H3" stroke="white" strokeWidth="2" strokeLinecap="round" />
              </svg>
              Log in
            </Link>
            }
          </div>
        </div>

        {/* MOBILE drawer */}
        <div className={`md:hidden overflow-hidden transition-[max-height] duration-300 ${open ? "max-h-64" : "max-h-0"}`}>
          <div className="mb-3 rounded-2xl border border-amber-200/60 bg-white/70 dark:bg-neutral-900/50 p-3 shadow-sm">
            <MobileLink href="/explore" label="Explore" onClick={() => setOpen(false)} />
            <MobileLink href="/deities" label="Deities" onClick={() => setOpen(false)} />
            <MobileLink href="/collections" label="Collections" onClick={() => setOpen(false)} />
            <MobileLink href="/about" label="About" onClick={() => setOpen(false)} />
            <div className="mt-2 pt-2 border-t border-amber-200/60">
              <Link
                href="/signin"
                onClick={() => setOpen(false)}
                className="inline-flex w-full items-center justify-center
                 gap-2 rounded-xl bg-gradient-to-r from-orange-600 via-amber-600
                  to-yellow-600 px-4 py-2 text-sm font-semibold text-white shadow"
              >
                Sign in
              </Link>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}

function NavLink({ href, label }) {
  return (
    <Link
      href={href}
      className="text-neutral-700/90 dark:text-neutral-200/90
       hover:text-amber-700 dark:hover:text-amber-300 transition font-medium"
    >
      {label}
    </Link>
  );
}

function MobileLink({ href, label, onClick }) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="block rounded-xl px-3 py-2 text-[15px] 
      font-medium text-neutral-800 dark:text-neutral-100 hover:bg-amber-50/80 dark:hover:bg-neutral-800/60"
    >
      {label}
    </Link>
  );
}
