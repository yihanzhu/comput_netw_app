import "@/styles/globals.css";
import Head from "next/head";
import Footer from "@/components/Footer";
import React, { useEffect, useState, useContext } from 'react';
import { io } from "socket.io-client";
import AssignmentsContext from './context/assignmentsContext'; // Make sure the path points to your assignmentsContext.js

export default function App({ Component, pageProps }) {
  const [assignments, setAssignments] = useState([]);

  useEffect(() => {
    const socket = io('http://localhost:5000');

    socket.on('update', (data) => {
       // Handle the data received from the backend
    });

    return () => socket.disconnect(); // Disconnect on unmount
  }, []);

  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;700&display=swap" rel="stylesheet" />
      </Head>
      <AssignmentsContext.Provider value={{ assignments, setAssignments }}>
        <main className="font-mont bg-light dark:bg-dark w-full min-h-screen">
          {/* <NavBar /> */}
          <Component {...pageProps} />
          <Footer />
        </main>
      </AssignmentsContext.Provider>
    </>
  );
}
