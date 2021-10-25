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
        <a href="#">The Kitten Society</a>
        <a href="#">Community</a>
        <a href="#">FAQ</a>
      </div>
    </div>
  );
}
