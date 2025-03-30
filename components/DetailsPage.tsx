"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { Heart, Archive } from "iconsax-react";

interface Genre {
  id: string;
  name: string;
}
interface Movie {
  title: string;
  tagline: string;
  release_date: string;
  genres: Genre[];
  overview: string;
  poster_path: string;
  runtime: number;
  favourite: boolean;
  bookmark: boolean;
}

export default function DetailsPage({ movieId }: { movieId: string }) {
  const [movie, setMovie] = useState<Movie | null>(null);
  const baseUrl = "https://image.tmdb.org/t/p/w500/";
  useEffect(() => {
    async function fetchMovie() {
      const options = {
        method: "GET",
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_TMDB_TOKEN}`,
        },
      };
      fetch(`https://api.themoviedb.org/3/movie/${movieId}`, options)
        .then((res) => res.json())
        .then((res) => {
          console.log(res);
          if (res)
            setMovie({
              title: res.title,
              tagline: res.tagline,
              release_date: res.release_date,
              genres: res.genres,
              overview: res.overview,
              poster_path: res.poster_path,
              runtime: res.runtime,
              favourite: false,
              bookmark: false,
            });
        })
        .catch((err) => console.error(err));
    }
    fetchMovie();
  }, [movieId]);
  // console.log(movie);
  return (
    <div className="py-[56px] flex flex-col gap-[12px] max-w-[1350px] w-[98%] items-center">
      {movie ? (
        <>
          <Image
            alt={movie.title + "poster"}
            src={`${baseUrl + movie.poster_path}`}
            width={500}
            height={500}
            className="rounded-[12px] max-w-[500px] w-[100%] h-auto"
          />
          <div className="flex flex-col max-w-[500px] w-full gap-[18px]">
            <div className="flex w-full justify-between">
              <h2 className="text-amber-400 font-[500] text-[32px]">
                {movie.title}
              </h2>
              <div className="flex gap-[16px]">
                <button
                  className="cursor-pointer hover:opacity-85"
                  onClick={() => {
                    const fav = !movie.favourite;
                    setMovie({ ...movie, favourite: fav });
                  }}
                >
                  {!movie.favourite ? (
                    <Heart size="24" color="white" />
                  ) : (
                    <Heart size="24" variant="Bold" color="red" />
                  )}
                </button>
                <button
                  className="cursor-pointer hover:opacity-85"
                  onClick={() => {
                    const bk = !movie.bookmark;
                    setMovie({ ...movie, bookmark: bk });
                  }}
                >
                  {!movie.bookmark ? (
                    <Archive size="24" color="white" />
                  ) : (
                    <Archive size="24" color="yellow" variant="Bulk" />
                  )}
                </button>
              </div>
            </div>
            <p className="text-gray-400 text-[16px] italic mt-[-24px]">
              {movie.tagline}
            </p>
            <div className="flex gap-[8px] flex-wrap">
              {movie.genres.map((value) => (
                <span
                  key={value.id}
                  className="bg-gray-200 rounded-[6px] text-gray-800 px-[12px] py-[4px] text-[12px] font-[500]"
                >
                  {value.name}
                </span>
              ))}
            </div>

            <div className="flex w-full justify-between">
              <p>
                <span className="text-[14px] text-gray-400">Released:</span>
                <span className="text-[16px] text-gray-200">
                  {" " + movie.release_date}
                </span>
              </p>
              <p>
                <span className="text-[14px] text-gray-400">Runtime: </span>
                <span className="text-[16px] text-gray-200">
                  {" " + movie.runtime + "mins"}
                </span>
              </p>
            </div>
            <p className="text-justify text-gray-200 ">{movie.overview}</p>
          </div>
        </>
      ) : (
        <div className="flex h-[calc(100dvh-72.5px-112px)] items-center">
          <h1 className="text-amber-400 text-[32px] animate-bounce">
            Loading...
          </h1>
        </div>
      )}
    </div>
  );
}
