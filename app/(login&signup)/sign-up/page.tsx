"use client";
import { useState } from "react";
import { useCreateUserWithEmailAndPassword } from "react-firebase-hooks/auth";
import { auth, db } from "@/app/firebase/config";
import { doc, setDoc, updateDoc } from "firebase/firestore";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeSlash } from "iconsax-react";
import Cookies from "js-cookie";
interface Error {
  id: number;
  message: string;
}
interface UserData {
  email: string;
  username: string;
  favourites: number[];
  bookmarks: number[];
}

function UserNameModal({ uid }: { uid: string }) {
  const [username, setUsername] = useState("");
  const router = useRouter();
  return (
    <div className="min-h-[100dvh] flex items-center justify-center flex-col font-sans backdrop-blur-[12px] bg-[#00000033] w-full z-50 absolute top-[0px]">
      <form
        className="p-[18px] sm:p-[32px] flex flex-col gap-[16px] max-w-[450px] sm:w-full w-[90%] glassBg text-neutral-800 "
        action={async () => {
          const userRef = doc(db, "users", uid);
          try {
            await updateDoc(userRef, {
              username: username,
            });
            router.push("/");
          } catch (err) {
            console.error(err);
          }
        }}
      >
        <label htmlFor="email" className="w-full flex flex-col gap-[4px] ">
          Enter username
          <input
            required
            type="text"
            name="username"
            className="text-[16px] rounded-[6px] border-[1px] border-neutral-600 py-[14px] px-[16px] placeholder:italic"
            onChange={(e) => setUsername(e.currentTarget.value)}
            value={username}
          />
        </label>
        <button
          type="submit"
          className="text-[#121212] mt-[48px] font-[500] w-full py-[16px] flex items-center justify-center text-[18px] bg-amber-400 rounded-[6px] cursor-pointer hover:opacity-[75%]"
        >
          Save
        </button>
      </form>
    </div>
  );
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
  const [showModal, setShowModal] = useState<boolean>(false);
  const [userId, setUserId] = useState<string | null>(null);

  //   console.log(error.message);

  async function createUser(user: UserData, uid: string) {
    try {
      await setDoc(doc(db, "users", uid), user);
      console.log("User created successfully");
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  }

  return (
    <div className="min-h-[100dvh] flex items-center justify-center flex-col font-sans bg-[#1a1a1a] w-full relative">
      {showModal && userId && <UserNameModal uid={userId as string} />}
      <form
        className="p-[18px] sm:p-[32px] flex flex-col gap-[16px] max-w-[600px] sm:w-full w-[90%] glassBg text-neutral-800 "
        action={async () => {
          setLoading(true);
          const response = await createUserWithEmailAndPassword(
            email,
            password
          );
          if (user || response?.user) {
            setUserId(response?.user.uid as string);
            const newUser: UserData = {
              email: response?.user.email as string,
              username: "",
              favourites: [],
              bookmarks: [],
            };
            await createUser(newUser, response?.user.uid as string);
            setEmail("");
            setPassword("");
            setPassword2("");
            const token = await response?.user.getIdToken();
            if (token) {
              Cookies.set("Firebase_token", token);
            }
            setShowModal(true);
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
              type="button"
            >
              <Eye size="16" color="black" />
            </button>
          ) : (
            <button
              className="cursor-pointer absolute bottom-[20px] right-[16px]"
              onClick={() => setShow(false)}
              type="button"
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
              type="button"
            >
              <Eye size="16" color="black" />
            </button>
          ) : (
            <button
              className="cursor-pointer absolute bottom-[20px] right-[16px]"
              onClick={() => setShow2(false)}
              type="button"
            >
              <EyeSlash size="16" color="black" />
            </button>
          )}
        </label>
        <button
          className="text-[#121212] mt-[48px] font-[500] w-full py-[16px] flex items-center justify-center text-[18px] bg-amber-400 rounded-[6px] cursor-pointer hover:opacity-[75%]"
          type="submit"
          disabled={loading || loadings || errors.id !== 0}
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
