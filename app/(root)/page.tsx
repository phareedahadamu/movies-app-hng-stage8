"use client";
import { useEffect, useState } from "react";
import { auth, db } from "@/app/firebase/config";
import { useAuthState } from "react-firebase-hooks/auth";
import Image from "next/image";
import { ArrowLeft2, ArrowRight2 } from "iconsax-react";
import { useRouter } from "next/navigation";
import RedirectModal from "@/components/RedirectModal";
import { doc, getDoc } from "firebase/firestore";
import Link from "next/link";

interface Popular {
  title: string;
  poster_path: string;
  id: string;
}
interface Movie {
  title: string;
  backdrop_path: string;
  id: string;
  favourite: boolean;
  bookmark: boolean;
}
export default function Home() {
  const baseUrl = "https://image.tmdb.org/t/p/w500/";
  const [user] = useAuthState(auth);
  const [currentPopular, setCurrentPopular] = useState<Popular | null>(null);
  const [currentPopular2, setCurrentPopular2] = useState<Popular | null>(null);
  const [current, setCurrent] = useState(0);
  const [topPopular, setTopPopular] = useState<Popular[]>([]);
  const [redirectModal, setRedirectModal] = useState<boolean>(false);
  const router = useRouter();
  const [username, setUsername] = useState<string | null>(null);
  const [favourites, setFavourites] = useState<Movie[] | null>(null);
  const [bookmarks, setBookmarks] = useState<Movie[] | null>(null);

  const uid = user?.uid;

  // console.log(user);
  useEffect(() => {
    async function fetchPopularMovies() {
      const options = {
        method: "GET",
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_TMDB_TOKEN}`,
        },
      };

      fetch("https://api.themoviedb.org/3/movie/popular", options)
        .then((res) => res.json())
        .then((res) => {
          const myArray = res.results.map((value: Popular) => ({
            title: value.title,
            poster_path: value.poster_path,
            id: value.id,
          }));
          setTopPopular(myArray);
          // console.log(myArray);
        })
        .catch((err) => console.error(err));
    }
    fetchPopularMovies();
  }, []);
  useEffect(() => {
    // console.log(topPopular[current]);
    setCurrentPopular({
      title: topPopular[current]?.title,
      poster_path: topPopular[current]?.poster_path,
      id: topPopular[current]?.id,
    });
    setCurrentPopular2({
      title: topPopular[current + 1]?.title,
      poster_path: topPopular[current + 1]?.poster_path,
      id: topPopular[current + 1]?.id,
    });
  }, [topPopular, current]);
  useEffect(() => {
    async function getUserInfo() {
      if (uid) {
        const docRef = doc(db, "users", uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setUsername(docSnap.data().username);
          const fav = docSnap.data().favourites;
          const bmk = docSnap.data().bookmarks;
          const options = {
            method: "GET",
            headers: {
              accept: "application/json",
              Authorization: `Bearer ${process.env.NEXT_PUBLIC_TMDB_TOKEN}`,
            },
          };
          // console.log(favourites[0]);

          const favouritePromises = fav.map((value: number) =>
            fetch(`https://api.themoviedb.org/3/movie/${value}`, options)
              .then((res) => res.json())
              .then((data) => ({
                title: data.title,
                id: data.id,
                backdrop_path: data.backdrop_path,
                favourite: true,
                bookmark: false,
              }))
          );

          const bookmarkPromises = bmk.map((value: number) =>
            fetch(`https://api.themoviedb.org/3/movie/${value}`, options)
              .then((res) => res.json())
              .then((data) => ({
                title: data.title,
                id: data.id,
                backdrop_path: data.backdrop_path,
                favourite: false,
                bookmark: true,
              }))
          );

          // Wait for all fetches to complete
          const fetchedFavourites = await Promise.all(favouritePromises);
          const fetchedBookmarks = await Promise.all(bookmarkPromises);

          // console.log(myMovies2);
          setFavourites(fetchedFavourites);
          setBookmarks(fetchedBookmarks);
        } else {
          console.log("No such document!");
        }
      }
    }
    if (uid) {
      getUserInfo();
    }
  }, [uid]);

  const favouriteComps = favourites?.map((value) => (
    <div
      key={value.id}
      className="rounded-[8px] bg-gray-800 sm:p-[16px] p-[8px] flex flex-col gap-[20px] items-center min-w-[250px]"
    >
      {value.backdrop_path ? (
        <Image
          alt={value.title}
          src={`${baseUrl + value.backdrop_path}`}
          width={500}
          height={500}
          className="rounded-[12px] max-w-[280px] w-[100%] h-auto"
        />
      ) : (
        <div className="rounded-[12px] max-w-[280px] w-[100%] h-[157.35px] bg-gray-600"></div>
      )}
      <div className="flex flex-col w-full gap-[10px]">
        <Link
          className="font-[500] text-[18px] hover:underline"
          href={`/details/${value.id}`}
        >
          {value.title}
        </Link>
      </div>
    </div>
  ));
  const bookmarkComps = bookmarks?.map((value) => (
    <div
      key={value.id}
      className="rounded-[8px] bg-gray-800 sm:p-[16px] p-[8px] flex flex-col gap-[20px] items-center min-w-[250px]"
    >
      {value.backdrop_path ? (
        <Image
          alt={value.title}
          src={`${baseUrl + value.backdrop_path}`}
          width={500}
          height={500}
          className="rounded-[12px] max-w-[280px] w-[100%] h-auto"
        />
      ) : (
        <div className="rounded-[12px] max-w-[280px] w-[100%] h-[157.35px] bg-gray-600"></div>
      )}
      <div className="flex flex-col w-full gap-[10px]">
        <Link
          className="font-[500] text-[18px] hover:underline"
          href={`/details/${value.id}`}
        >
          {value.title}
        </Link>
      </div>
    </div>
  ));
  return (
    <div className="min-h-[100dvh] flex flex-col py-[40px] max-w-[1350px] w-[98%] gap-[48px] relative items-stretch">
      {redirectModal && <RedirectModal close={setRedirectModal} />}
      {username && (
        <p className="text-[18px]">
          Welcome,{" "}
          <span className="text-[24px] text-amber-400">
            {username.toUpperCase()}
          </span>
        </p>
      )}
      <div className=" flex flex-col gap-[12px]">
        <div className="flex  gap-[24px]">
          <p className="text-[24px] font-[500]">Popular Movies</p>
          <button
            className="cursor-pointer"
            onClick={() => {
              if (user) router.push("/popular");
              else setRedirectModal(true);
            }}
          >
            View all
          </button>
        </div>

        {currentPopular && currentPopular2 ? (
          <div className="hidden lg:flex justify-center relative gap-[16px]">
            <Image
              onClick={() => {
                if (user) router.push(`/details/${currentPopular?.id}`);
                else setRedirectModal(true);
              }}
              alt={`${
                currentPopular
                  ? currentPopular?.title + " poster"
                  : "movie poster"
              }`}
              src={`${baseUrl + currentPopular?.poster_path}`}
              width={500}
              height={500}
              className="rounded-[12px] max-w-[500px] w-[100%] h-auto cursor-pointer"
            />
            <Image
              onClick={() => {
                if (user) router.push(`/details/${currentPopular2?.id}`);
                else setRedirectModal(true);
              }}
              alt={`${
                currentPopular2
                  ? currentPopular2?.title + " poster"
                  : "movie poster"
              }`}
              src={`${baseUrl + currentPopular2?.poster_path}`}
              width={500}
              height={500}
              className="rounded-[12px] max-w-[500px] w-[100%] h-auto cursor-pointer"
            />
            <button
              className="absolute top-[45%] left-[16px] cursor-pointer hover:opacity-80 bg-gray-500 rounded-[6px]"
              onClick={() => {
                if (current === 0) setCurrent(18);
                else setCurrent((prev) => prev - 2);
              }}
            >
              <ArrowLeft2 size="56" color="black" />
            </button>
            <button
              className="absolute top-[45%] right-[16px] cursor-pointer hover:opacity-80 bg-gray-500 rounded-[6px]"
              onClick={() => {
                if (current === 18) setCurrent(0);
                else setCurrent((prev) => prev + 2);
              }}
            >
              <ArrowRight2 size="56" color="black" />
            </button>
          </div>
        ) : (
          <div className="flex h-[750px] items-center w-full">
            <h1 className="text-amber-400 text-[32px] animate-bounce w-full text-center">
              Loading...
            </h1>
          </div>
        )}
        {currentPopular ? (
          <div className="lg:hidden flex justify-center relative gap-[16px]">
            <Image
              onClick={() => {
                if (user) router.push(`/details/${currentPopular?.id}`);
                else setRedirectModal(true);
              }}
              alt={`${
                currentPopular
                  ? currentPopular?.title + " poster"
                  : "movie poster"
              }`}
              src={`${baseUrl + currentPopular?.poster_path}`}
              width={500}
              height={500}
              className="rounded-[12px] max-w-[500px] w-[100%] h-auto cursor-pointer"
            />
            <button
              className="absolute top-[45%] left-[16px] cursor-pointer hover:opacity-80 bg-gray-500 rounded-[6px]"
              onClick={() => {
                if (current === 0) setCurrent(19);
                else setCurrent((prev) => prev - 1);
              }}
            >
              <ArrowLeft2 size="56" color="black" />
            </button>
            <button
              className="absolute top-[45%] right-[16px] cursor-pointer hover:opacity-80 bg-gray-500 rounded-[6px]"
              onClick={() => {
                if (current === 19) setCurrent(0);
                else setCurrent((prev) => prev + 1);
              }}
            >
              <ArrowRight2 size="56" color="black" />
            </button>
          </div>
        ) : (
          <div className="flex h-[750px] items-center w-full">
            <h1 className="text-amber-400 text-[32px] animate-bounce w-full  text-center">
              Loading...
            </h1>
          </div>
        )}
      </div>
      {user && (
        <div className="flex flex-col gap-[16px] mt-[60px]">
          <p className="text-[24px] font-[500] text-amber-400">
            Your Favourites
          </p>

          {favourites && favourites.length === 0 ? (
            <p>You have no favourites</p>
          ) : (
            <div className="flex w-full overflow-x-scroll gap-[16px]">
              {favouriteComps}
            </div>
          )}
        </div>
      )}
      {user && (
        <div className="flex flex-col gap-[16px] mt-[60px]">
          <p className="text-[24px] font-[500] text-amber-400">
            Your BookMarks
          </p>

          {bookmarks && bookmarks.length === 0 ? (
            <p>You have no bookmarks</p>
          ) : (
            <div className="flex w-full overflow-x-scroll gap-[16px]">
              {bookmarkComps}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
