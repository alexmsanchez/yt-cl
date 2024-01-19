"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { SignIn } from "./sign-in";
import { onAuthStateChangedHelper } from "../firebase/firebase";
import { User } from "firebase/auth";
import { Upload } from "./upload";

export default function Navbar() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChangedHelper((user) => setUser(user));

    // Clean up on unmount
    return () => unsubscribe();
  }, []);

  return (
    <div className="flex items-center p-[1em] justify-between">
      <div className="cursor-pointer">
        <Link href="/">
          <Image
            src="/youtube-logo.svg"
            alt="YouTube Logo"
            width={90}
            height={20}
          />
        </Link>
      </div>
      {user && <Upload />}
      <SignIn user={user} />
    </div>
  );
}
