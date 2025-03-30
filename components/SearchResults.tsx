"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { Heart, Archive, ArrowLeft2, ArrowRight2 } from "iconsax-react";
import RedirectModal from "@/components/RedirectModal";
import { auth } from "@/app/firebase/config";
import { useAuthState } from "react-firebase-hooks/auth";
import { useRouter } from "next/navigation";
interface Movie {
  title: string;
  backdrop_path: string;
  id: string;
  favourite: boolean;
  bookmark: boolean;
}
function MovieComponents({
  movies,
  toggleFavourite,
  toggleBookmark,
  isAuth,
  setRedirectModal,
}: {
  movies: Movie[];
  toggleFavourite: (value: number) => void;
  toggleBookmark: (value: number) => void;
  isAuth: boolean;
  setRedirectModal: (value: boolean) => void;
}) {
  const baseUrl = "https://image.tmdb.org/t/p/w500/";
  const router = useRouter();
  return movies.map((value, index) => (
    <div
      key={value.id}
      className="rounded-[8px] bg-gray-800 sm:p-[16px] p-[8px] flex flex-col gap-[20px] items-center"
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
        <p
          onClick={() => {
            if (!isAuth) {
              setRedirectModal(true);
            } else {
              router.push(`/details/${value.id}`);
            }
          }}
          className="font-[500] text-[18px] hover:underline cursor-pointer"
        >
          {value.title}
        </p>
        <div className="flex gap-[16px]">
          <button
            className="cursor-pointer hover:opacity-85"
            onClick={() => {
              // console.log(index);
              if (!isAuth) {
                setRedirectModal(true);
              } else toggleFavourite(index);
            }}
          >
            {!value.favourite ? (
              <Heart size="24" color="white" />
            ) : (
              <Heart size="24" variant="Bold" color="red" />
            )}
          </button>
          <button
            className="cursor-pointer hover:opacity-85"
            onClick={() => {
              // console.log(index);
              if (!isAuth) {
                setRedirectModal(true);
              } else toggleBookmark(index);
            }}
          >
            {!value.bookmark ? (
              <Archive size="24" color="white" />
            ) : (
              <Archive size="24" color="yellow" variant="Bulk" />
            )}
          </button>
        </div>
      </div>
    </div>
  ));
}
export default function SearchResult({ query }: { query: string }) {
  const [totalPages, setTotalPages] = useState(0);
  const [page, setPage] = useState(1);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [user] = useAuthState(auth);
  const [redirectModal, setRedirectModal] = useState<boolean>(false);

  function toggleFavourite(index: number) {
    const current = movies[index].favourite;
    const newArray = movies.slice();
    newArray[index].favourite = !current;
    setMovies(newArray);
  }
  function toggleBookmark(index: number) {
    const current = movies[index].bookmark;
    const newArray = movies.slice();
    newArray[index].bookmark = !current;
    setMovies(newArray);
  }

  useEffect(() => {
    async function fetchMovies() {
      const options = {
        method: "GET",
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_TMDB_TOKEN}`,
        },
      };

      fetch(
        `https://api.themoviedb.org/3/search/movie?query=${query}&page=${page}`,
        options
      )
        .then((res) => res.json())
        .then((res) => {
          //   console.log(res);
          setTotalPages(res.total_pages);
          const myArray = res.results.map((value: Movie) => ({
            title: value.title,
            backdrop_path: value.backdrop_path,
            id: value.id,
            favorite: false,
            bookmark: false,
          }));
          setMovies(myArray);
          // console.log(myArray);
        })
        .catch((err) => console.error(err));
    }
    fetchMovies();
  }, [page, query]);
  return (
    <div className="py-[48px] flex flex-col gap-[18px] max-w-[1350px] w-[98%] relative">
      {redirectModal && <RedirectModal close={setRedirectModal} />}
      <p>Showing results for {query.replace("%20", " ")}</p>
      {movies.length !== 0 ? (
        <div className="flex flex-col gap-[18px]">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-x-[24px] gap-y-[24px] w-full">
            <MovieComponents
              movies={movies}
              toggleFavourite={toggleFavourite}
              toggleBookmark={toggleBookmark}
              isAuth={user ? true : false}
              setRedirectModal={setRedirectModal}
            />
          </div>
          <div className="flex items-center w-full justify-center gap-[12px]">
            <button
              className="py-[6px] px-[12px] rounded-[6px] bg-gray-400 text-black flex gap-[12px] cursor-pointer disabled:cursor-not-allowed hover:opacity-85"
              disabled={page === 1}
              onClick={() => setPage((prev) => prev - 1)}
            >
              <ArrowLeft2 size="18" color="black" />
              <p>Previous</p>
            </button>
            <p className="text-gray-300 text-nowrap italic">{`Page ${page} of ${totalPages}`}</p>
            <button
              className="py-[6px] px-[12px] rounded-[6px] bg-gray-400 text-black flex gap-[12px] cursor-pointer disabled:cursor-not-allowed hover:opacity-85"
              disabled={page === totalPages}
              onClick={() => setPage((prev) => prev + 1)}
            >
              <p>Next</p>
              <ArrowRight2 size="18" color="black" />
            </button>
          </div>
        </div>
      ) : (
        <div className="flex h-[500px] items-center w-full">
          <h1 className="text-amber-400 text-[32px] animate-bounce w-full text-center">
            Loading...
          </h1>
        </div>
      )}
    </div>
  );
}
