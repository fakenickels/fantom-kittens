import React from "react";
import Image from "next/image";
import Link from "next/link";

export default function Header() {
  return (
    <div className="flex flex-row p-5 mb-10 items-center">
      <Link href="/">
        <a>
          <Image
            src={require("../public/assets/logo.png")}
            width={60}
            height={60}
            alt="logo"
          />
        </a>
      </Link>

      <div className="ml-auto flex flex-row text-white space-x-4">
        <a
          href="https://discord.gg/VB9nXy28Rw"
          target="_blank"
          rel="noreferrer"
        >
          Community
        </a>
        <a href="/assets/manifest.txt" target="_blank" rel="noreferrer">
          The Kitten Society
        </a>
        <a href="/assets/about_us.txt" target="_blank" rel="noreferrer">
          About us
        </a>
      </div>
    </div>
  );
}
