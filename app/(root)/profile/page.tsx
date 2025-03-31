"use client";
import { useEffect, useState } from "react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { auth, db } from "@/app/firebase/config";
import { useAuthState } from "react-firebase-hooks/auth";
import { Edit2, TickSquare } from "iconsax-react";

export default function ProfilePage() {
  const [user] = useAuthState(auth);
  const uid = user?.uid;
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [favCount, setFavCount] = useState(0);
  const [bkCount, setBkCount] = useState(0);
  const [edit, setEdit] = useState(false);

  useEffect(() => {
    async function getUserInfo() {
      if (uid) {
        const docRef = doc(db, "users", uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setUsername(docSnap.data().username);
          setEmail(docSnap.data().email);
          setFavCount(docSnap.data().favourites.length);
          setBkCount(docSnap.data().bookmarks.length);
        } else {
          console.log("No such document!");
        }
      }
    }
    if (uid) {
      getUserInfo();
    }
  }, [uid]);
  return (
    <div className="min-h-[calc(100dvh-72.5px)] flex flex-col py-[40px] max-w-[1350px] w-[98%] gap-[48px] relative items-center justify-center">
      <div className="flex flex-col gap-[20px] rounded-[12px] max-w-[800px] w-[98%] bg-gray-800 sm:p-[32px] p-[16px]">
        <div className="flex flex-col gap-[8px] border-b-[1px] border-b-gray-300 pb-[12px]">
          <p className="text-[24px] font-[500]">Username</p>
          {!edit ? (
            <div className="flex gap-[12px]">
              <p className="text-[20px] text-gray-200">{username}</p>
              <button
                className="cursor-pointer hover:opacity-85"
                onClick={() => {
                  setEdit(true);
                }}
              >
                <Edit2 size="24" color="white" />
              </button>
            </div>
          ) : (
            <form
              className="flex gap-[12px]"
              action={async () => {
                if (uid) {
                  const userRef = doc(db, "users", uid);
                  try {
                    await updateDoc(userRef, {
                      username: username,
                    });
                  } catch (err) {
                    console.error(err);
                  } finally {
                    setEdit(false);
                  }
                }
              }}
            >
              <input
                className="text-[20px] text-gray-200"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.currentTarget.value)}
              />
              <button className="cursor-pointer hover:opacity-85" type="submit">
                <TickSquare size="24" color="white" />
              </button>
            </form>
          )}
        </div>
        <div className="flex flex-col gap-[8px] border-b-[1px] border-b-gray-300 pb-[12px]">
          <p className="text-[24px] font-[500]">Email</p>
          <p className="text-[20px] text-gray-200">{email}</p>
        </div>
        <div className="flex">
          <div className="flex flex-col basis-[50%] pb-[12px] border-r-[1px] border-r-gray-300">
            <p className="text-[20px] text-gray-200">Favourited movies</p>
            <p className="text-[24px] font-[700] text-amber-400">{favCount}</p>
          </div>
          <div className="flex flex-col basis-[50%] pb-[12px]  items-end text-right">
            <p className="text-[20px] text-gray-200">Bookmarked movies</p>
            <p className="text-[24px] font-[700] text-amber-400">{bkCount}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
