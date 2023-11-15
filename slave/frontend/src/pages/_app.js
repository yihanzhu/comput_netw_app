// import NavBar from "@/components/NavBar";
import "@/styles/globals.css";
import Head from "next/head";
import Footer from "@/components/Footer";
import React, { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";

export default function App({ Component, pageProps }) {
  const socketRef = useRef(null);

  useEffect(() => {
    socketRef.current = io("http://localhost:5000");
    const socket = socketRef.current;

    socket.on("update", (data) => {
      // Handle the data received from the backend
    });

    return () => socket.disconnect(); // Disconnect on unmount
  }, []);

  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        {/* <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;700&display=swap" rel="stylesheet" /> */}
      </Head>
      <main className="font-mont bg-light dark:bg-dark w-full min-h-screen">
        {/* <NavBar /> */}
        <Component {...pageProps} />
        <Footer />
      </main>
    </>
  );
}
