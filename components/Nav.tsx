"use client";
import Link from "next/link";
import { SearchNormal, HambergerMenu, CloseSquare } from "iconsax-react";
import { signOut } from "firebase/auth";
import { auth } from "@/app/firebase/config";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
export default function Nav({
  isAuth,
  email,
}: {
  isAuth: boolean;
  email: string;
}) {
  // console.log(isAuth);
  const [query, setQuery] = useState("");
  const [menu, setMenu] = useState<boolean>(false);
  const router = useRouter();
  function handleSearch() {
    if (query.trim() === "") {
      setQuery("");
      return;
    }
    setQuery("");
    router.push(`/search/${query}`);
  }
  return (
    <nav className="w-full bg-[#1a1a1a] flex justify-center">
      <div className="max-w-[1350px] w-[98%] flex justify-between font-sans py-[12px] items-center gap-[18px] relative">
        <Link href="/">
          <div className="bg-amber-400 rounded-[6px] text-[#121212] font-mono text-[27px] px-[12px] py-[4px] tracking-wide">
            FaDB
          </div>
        </Link>
        <form
          className="rounded-[6px] max-w-[600px] w-full bg-white flex py-[8px] px-[16px]"
          action={() => handleSearch()}
        >
          <input
            type="text"
            placeholder="Search FaDB"
            className="w-full placeholder:text-gray-500 placeholder:italic text-[#575757]"
            value={query}
            onChange={(e) => setQuery(e.currentTarget.value)}
          />
          <button className="cursor-pointer" type="submit">
            <SearchNormal color="#575757" size="24" />
          </button>
        </form>
        {!isAuth ? (
          <>
            <div className="md:flex hidden gap-[16px] text-[18px] font-[500]">
              <Link
                href="/login"
                className="hover:bg-gray-500 rounded-full px-[12px] py-[6px]"
              >
                Login
              </Link>
              <Link
                href="/sign-up"
                className="hover:bg-gray-500 rounded-full px-[12px] py-[6px]"
              >
                Sign up
              </Link>
            </div>
          </>
        ) : (
          <div className="md:flex hidden gap-[16px] text-[18px] font-[500]">
            <Link
              href="/profile"
              className="size-[45px] bg-gray-700 text-amber-400 text-center rounded-full leading-[45px] font-bold text-[20px]"
            >
              {email[0].toUpperCase()}
            </Link>
            <button
              className="hover:bg-gray-500 rounded-full px-[12px] py-[6px]"
              onClick={() => {
                signOut(auth);
                Cookies.remove("Firebase_token");
                router.push("/");
              }}
            >
              Log out
            </button>
          </div>
        )}
        <button
          className="cursor-pointer hover:opacity-85 md:hidden flex"
          onClick={() => {
            setMenu(true);
          }}
        >
          <HambergerMenu color="white" size="32" />
        </button>
        {menu &&
          (!isAuth ? (
            <div className="flex flex-col absolute top-[32px] right-[0px] bg-gray-50 rounded-[8px] w-[280px] text-gray-900 items-stretch p-[16px] z-50 md:hidden">
              <button
                className="cursor-pointer hover:opacity-85 flex justify-end pb-[6px]"
                onClick={() => {
                  // console.log("hi");
                  setMenu(false);
                }}
              >
                <CloseSquare size="30" color="black" />
              </button>
              <Link
                href="/login"
                className="hover:bg-gray-500  py-[6px] border-b-[1px] border-b-gray-500 w-full"
              >
                Login
              </Link>
              <Link
                href="/sign-up"
                className="hover:bg-gray-500  py-[6px] w-full"
              >
                Sign up
              </Link>
            </div>
          ) : (
            <div className="flex flex-col absolute top-[32px] right-[0px] bg-gray-50 rounded-[8px] w-[280px] text-gray-900 items-stretch p-[16px] z-50 md:hidden">
              <button
                className="cursor-pointer hover:opacity-85 flex justify-end pb-[6px]"
                onClick={() => {
                  // console.log("hi");
                  setMenu(false);
                }}
              >
                <CloseSquare size="30" color="black" />
              </button>
              <Link
                onClick={() => setMenu(false)}
                href="/profile"
                className="hover:bg-gray-500  py-[6px] border-b-[1px] border-b-gray-500 w-full"
              >
                Your Profile
              </Link>
              <button
                className="hover:bg-gray-500  py-[6px] w-full flex justify-start"
                onClick={() => {
                  setMenu(false);
                  signOut(auth);
                  Cookies.remove("Firebase_token");
                  router.push("/");
                }}
              >
                Log out
              </button>
            </div>
          ))}
      </div>
    </nav>
  );
}
