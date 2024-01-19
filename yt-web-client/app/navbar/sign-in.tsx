"use client";

import { FC } from "react";
import { signInWithGoogle, signOut } from "../firebase/firebase";
import { User } from "firebase/auth";

interface SignInProps {
  user: User | null;
}

interface ButtonProps {
  label: string;
  onClick: () => void;
}

const Button: FC<ButtonProps> = ({ label, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="inline-block bg-gray-200 hover:bg-[#bee0fd] hover:border-transparent text-[#065fd4] px-[20px] py-[10px] border-1 hover:border-1 border border-black rounded-3xl font-arial font-medium text-l"
    >
      {label}
    </button>
  );
};

export const SignIn: FC<SignInProps> = ({ user }) => {
  return (
    <>
      {user ? (
        <Button label="Sign Out" onClick={signOut} />
      ) : (
        <Button label="Sign In" onClick={signInWithGoogle} />
      )}
    </>
  );
};
