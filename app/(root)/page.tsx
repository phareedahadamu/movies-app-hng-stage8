"use client";
import { useEffect, useState } from "react";
import { auth } from "@/app/firebase/config";
import { useAuthState } from "react-firebase-hooks/auth";
import Image from "next/image";
import { ArrowLeft2, ArrowRight2 } from "iconsax-react";
import { useRouter } from "next/navigation";
import RedirectModal from "@/components/RedirectModal";

interface Popular {
  title: string;
  poster_path: string;
  id: string;
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
  return (
    <div className="min-h-[100dvh] flex flex-col py-[80px] max-w-[1350px] w-[98%] gap-[32px] relative items-stretch">
      {redirectModal && <RedirectModal close={setRedirectModal} />}
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
        <div>
          <p className="text-[24px] font-[500] text-amber-400">
            Your Favourites
          </p>
        </div>
      )}
    </div>
  );
}
