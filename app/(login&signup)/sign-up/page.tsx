"use client";
import { useState } from "react";
import { useCreateUserWithEmailAndPassword } from "react-firebase-hooks/auth";
import { auth } from "@/app/firebase/config";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeSlash } from "iconsax-react";
interface Error {
  id: number;
  message: string;
}
export default function SignUpPage() {
  const [loading, setLoading] = useState<boolean>(false);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [password2, setPassword2] = useState<string>("");
  const [errors, setErrors] = useState<Error>({ id: 0, message: "" });
  const [show, setShow] = useState<boolean>(false);
  const [show2, setShow2] = useState<boolean>(false);
  const [createUserWithEmailAndPassword, user, loadings, error] =
    useCreateUserWithEmailAndPassword(auth);
  const router = useRouter();
  //   console.log(error.message);

  return (
    <div className="min-h-[100dvh] flex items-center justify-center flex-col font-sans bg-[#1a1a1a] w-full ">
      <form
        className="p-[18px] sm:p-[32px] flex flex-col gap-[16px] max-w-[600px] sm:w-full w-[90%] glassBg text-neutral-800 "
        action={async () => {
          setLoading(true);
          const response = await createUserWithEmailAndPassword(
            email,
            password
          );
          if (user || response?.user) {
            setEmail("");
            setPassword("");
            setPassword2("");
            router.push("/");
          }
          setLoading(false);
        }}
      >
        <h1 className="text-[32px] font-[500] mb-[24px]">Sign Up</h1>
        <label htmlFor="email" className="w-full flex flex-col gap-[4px] ">
          Email
          <input
            required
            type="email"
            placeholder="username.example.com"
            name="email"
            className="text-[16px] rounded-[6px] border-[1px] border-neutral-600 py-[14px] px-[16px] placeholder:italic"
            onChange={(e) => setEmail(e.currentTarget.value)}
            value={email}
          />
        </label>
        <label
          htmlFor="password"
          className="w-full flex flex-col gap-[4px] relative"
        >
          Password
          <input
            required
            type={show ? "text" : "password"}
            name="password"
            className="text-[16px] rounded-[6px] border-[1px] border-neutral-600 py-[14px] px-[16px]"
            onChange={(e) => setPassword(e.currentTarget.value)}
            value={password}
          />
          {!show ? (
            <button
              className="cursor-pointer absolute bottom-[20px] right-[16px]"
              onClick={() => setShow(true)}
            >
              <Eye size="16" color="black" />
            </button>
          ) : (
            <button
              className="cursor-pointer absolute bottom-[20px] right-[16px]"
              onClick={() => setShow(false)}
            >
              <EyeSlash size="16" color="black" />
            </button>
          )}
        </label>
        <label
          htmlFor="password2"
          className="w-full flex flex-col gap-[4px] relative"
        >
          <p className="flex flex-col sm:flex-row gap-[6px]">
            <span>Confirm Password</span>
            {errors.id === 1 && (
              <span className="italic text-red-500 text-[12px]">
                {errors.message}
              </span>
            )}
          </p>
          <input
            required
            type={show2 ? "text" : "password"}
            name="password2"
            className="text-[16px] rounded-[6px] border-[1px] border-neutral-600 py-[14px] px-[16px]"
            onChange={(e) => setPassword2(e.currentTarget.value)}
            value={password2}
            onBlur={() => {
              if (password !== password2) {
                setErrors({ id: 1, message: "Password does not match" });
                setLoading(true);
              }
            }}
            onBeforeInput={() => {
              if (errors.id === 1) setErrors({ id: 0, message: "" });
              setLoading(false);
            }}
          />
          {!show2 ? (
            <button
              className="cursor-pointer absolute bottom-[20px] right-[16px]"
              onClick={() => setShow2(true)}
            >
              <Eye size="16" color="black" />
            </button>
          ) : (
            <button
              className="cursor-pointer absolute bottom-[20px] right-[16px]"
              onClick={() => setShow2(false)}
            >
              <EyeSlash size="16" color="black" />
            </button>
          )}
        </label>
        <button
          className="text-[#121212] mt-[48px] font-[500] w-full py-[16px] flex items-center justify-center text-[18px] bg-amber-400 rounded-[6px] cursor-pointer hover:opacity-[75%]"
          type="submit"
          disabled={loading || loadings}
        >
          Sign Up
        </button>
        {error && (
          <p className="py-[8px] px-[16px] bg-red-200 text-red-500 fonr-[400] w-full rounded-[4px]">
            {error.message}
          </p>
        )}
        <p className="font-[400]">
          Already have an account?{" "}
          <Link href="/login" className="underline text-purple-950 font-[500]">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
}
