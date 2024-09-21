'use client';

import localFont from "next/font/local";
import Image from 'next/image'
import "./globals.css";

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { useRouter } from 'next/navigation';

import NavBarLeft from "./ui/layout/navBar-left";
import NavBarTop from "./ui/layout/navBar-top-mobile";
import NavBarBottom from "./ui/layout/navBar-bottom-mobile";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export default function RootLayout({ children, title }) {

  const router = useRouter();
  const pathName = usePathname();
  const [username, setUsername] = useState('')

  // Check user's Authentication, if not signed-in, redirect to sign-in page
  useEffect(() => {
    const checkAuth = () => {
      const { username, id, token } = JSON.parse(localStorage.getItem('user')) || {}
      if (!username || !token) {
        console.log('Invalid login credentials, please log in');
        router.push('/sign-in');
        return
      }
      setUsername(username)
    }

    if (pathName != '/sign-in' && pathName != '/sign-up')
      checkAuth();

  }, [router, pathName]);

  return (
    <html lang="en">

      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>

        {/* Top Bar Section - Logo & Setting (in mobile view)*/}
        <div className="md:hidden">
          {username && <NavBarTop />}
        </div>

        <div className="flex min-h-screen bg-slate-50">

          {/* Left Section - Nav Bar */}
          {username && <NavBarLeft username={username} />}

          {/* Middle Section - Main */}
          <div className="flex flex-col grow items-center">

            {/* Dummy-Gap Mobile-view */}
            <div className="md:hidden py-10"></div>

            {/* Render children Page */}
            <main className="grow flex flex-col items-center w-full">
              {children}
            </main>

            {/* Mid-Bottom footer */}
            <footer className="flex px-6 text-xs">
              <li className="hover:cursor-pointer list-none mx-1"> Created by YcWong 2024 </li>
              <li className="hover:cursor-pointer list-none mx-1">Threads Terms</li>
              <li className="hover:cursor-pointer list-none mx-1">Privacy Policy</li>
              <li className="hover:cursor-pointer list-none mx-1">Cookies Policy</li>
              <li className="hover:cursor-pointer list-none mx-1">Report a problem </li>
            </footer>
          </div>
        </div>

        {/* Bottom Bar Section - 5 buttons(in mobile view)*/}
        <div className="md:hidden">
          {username &&
            <NavBarBottom username={username} />}
        </div>

      </body>

    </html>
  );
}
