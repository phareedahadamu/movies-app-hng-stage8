"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Heart, Archive, ArrowLeft2, ArrowRight2 } from "iconsax-react";

interface Popular {
  title: string;
  backdrop_path: string;
  id: string;
  favourite: boolean;
  bookmark: boolean;
}
function MovieComponents({
  topPopular,
  toggleFavourite,
  toggleBookmark,
}: {
  topPopular: Popular[];
  toggleFavourite: (value: number) => void;
  toggleBookmark: (value: number) => void;
}) {
  const baseUrl = "https://image.tmdb.org/t/p/w500/";
  return topPopular.map((value, index) => (
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
        <Link
          className="font-[500] text-[18px] hover:underline"
          href={`/details/${value.id}`}
        >
          {value.title}
        </Link>
        <div className="flex gap-[16px]">
          <button
            className="cursor-pointer hover:opacity-85"
            onClick={() => {
              // console.log(index);
              toggleFavourite(index);
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
              toggleBookmark(index);
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
export default function Page() {
  const [topPopular, setTopPopular] = useState<Popular[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  function toggleFavourite(index: number) {
    const current = topPopular[index].favourite;
    const newArray = topPopular.slice();
    newArray[index].favourite = !current;
    setTopPopular(newArray);
  }
  function toggleBookmark(index: number) {
    const current = topPopular[index].bookmark;
    const newArray = topPopular.slice();
    newArray[index].bookmark = !current;
    setTopPopular(newArray);
  }
  useEffect(() => {
    async function fetchPopularMovies() {
      const options = {
        method: "GET",
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_TMDB_TOKEN}`,
        },
      };

      fetch(`https://api.themoviedb.org/3/movie/popular?page=${page}`, options)
        .then((res) => res.json())
        .then((res) => {
          // console.log(res);
          setTotalPages(res.total_pages);
          const myArray = res.results.map((value: Popular) => ({
            title: value.title,
            backdrop_path: value.backdrop_path,
            id: value.id,
            favorite: false,
            bookmark: false,
          }));
          setTopPopular(myArray);
          // console.log(myArray);
        })
        .catch((err) => console.error(err));
    }
    fetchPopularMovies();
  }, [page]);

  return (
    <div className="py-[48px] flex flex-col gap-[18px] max-w-[1350px] w-[98%]">
      <h1>Popular Movies</h1>
      {topPopular.length !== 0 ? (
        <div className="flex flex-col gap-[18px]">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-x-[24px] gap-y-[24px] w-full">
            <MovieComponents
              topPopular={topPopular}
              toggleFavourite={toggleFavourite}
              toggleBookmark={toggleBookmark}
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
