// import Link from "next/link";
import React from "react";
import Layout from "./Layout";

const Footer = () => {
  return (
    <footer className="w-full border-t-2 border-solid font-medium text-lg dark:text-light sm:text-base">
      <Layout className=" flex items-center justify-between lg:flex-col py-4 xs:py-4 sm:py-4 md:py-4 lg:py-4 xl:py-4">
        <span>{new Date().getFullYear()}&copy; All Rights Reserved. </span>
        {/* <div className="flex items-center lg:py-2">
          Build With{" "}
          <span className="text-primary dark:text-primaryDark text-2xl px-1">
            {" "}
            &#9825;{" "}
          </span>
          by&nbsp;{" "}
          <Link
            href="https://yihanzhu.com"
            className="underline underline-offset-2"
          >
            YihanZhu
          </Link>
        </div>
        <Link
          href="https://yihanzhu.com"
          target={"_blank"}
          className="underline underline-offset-2"
        >
          Say hello
        </Link> */}
      </Layout>
    </footer>
  );
};

export default Footer;
