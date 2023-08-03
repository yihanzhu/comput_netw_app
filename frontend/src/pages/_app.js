// import NavBar from "@/components/NavBar";
import "@/styles/globals.css";
import Head from "next/head";
import Footer from "@/components/Footer";

export default function App({ Component, pageProps }) {
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;700&display=swap" rel="stylesheet" />
      </Head>
      <main
        className="font-mont bg-light dark:bg-dark w-full min-h-screen"
      >
        {/* <NavBar /> */}
        <Component {...pageProps} />
        <Footer />
      </main>
    </>
  );
}
