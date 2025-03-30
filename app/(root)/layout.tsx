"use client";
import Nav from "@/components/Nav";
import { auth } from "@/app/firebase/config";
import { useAuthState } from "react-firebase-hooks/auth";
export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [user] = useAuthState(auth);
  return (
    <div className="min-h-[100dvh] bg-[#121212] text-white flex flex-col items-center w-full">
      <Nav isAuth={user ? true : false} email={user?.email as string} />{" "}
      {children}
    </div>
  );
}
