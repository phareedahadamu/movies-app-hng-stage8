import Link from "next/link";
import { CloseCircle } from "iconsax-react";
export default function RedirectModal({
  close,
}: {
  close: (value: boolean) => void;
}) {
  return (
    <div className="backdrop-blur-[12px] bg-[#00000033] h-[100dvh] absolute top-[0px] z-50 w-full mt-[-72.5px] flex items-center justify-center">
      <div className="flex px-[24px] py-[12px] rounded-[8px] bg-gray-50 border-[1px] border-gray-700 text-gray-900 gap-[16px] text-[18px]">
        <p>
          You have to be signed in to use this feature.{" "}
          <Link
            href="/login"
            className="hover:underline text-amber-800 font-bold"
          >
            Login
          </Link>
          {" or "}
          <Link
            href="/sign-up"
            className="hover:underline text-amber-800 font-bold"
          >
            Sign up
          </Link>
        </p>
        <button
          onClick={() => {
            close(false);
          }}
          className="cursor-pointer"
        >
          <CloseCircle size="30" color="black" />
        </button>
      </div>
    </div>
  );
}
