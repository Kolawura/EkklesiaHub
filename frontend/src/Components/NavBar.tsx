import Link from "next/link";
import React from "react";
import Image from "next/image";

export const NavBar = () => {
  return (
    <header className="flex items-center justify-between p-4 bg-gray-800 text-white">
      <div className="flex items-center space-x-4">
        <Image
          className="dark:invert"
          src="/AuDev_logo.png"
          alt="Audev logo"
          width={40}
          height={40}
          priority
        />
        <h1 className="text-3xl font-bold">EkklesiaHub</h1>
      </div>
      <nav>
        <ul className="flex items-center justify-between p-4 bg-gray-800 text-white">
          <li className="mr-6">
            <Link className="text-white hover:text-gray-400" href="/">
              Home
            </Link>
          </li>
          <li className="mr-6">
            <Link className="text-white hover:text-gray-400" href="/about">
              About
            </Link>
          </li>
          <li className="mr-6">
            <Link className="text-white hover:text-gray-400" href="/blogs">
              Blogs
            </Link>
          </li>
          <li className="mr-6">
            <Link className="text-white hover:text-gray-400" href="/posts">
              posts
            </Link>
          </li>
          <li className="mr-6">
            <Link className="text-white hover:text-gray-400" href="/Community">
              Community
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
};
