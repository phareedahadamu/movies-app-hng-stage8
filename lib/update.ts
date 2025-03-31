import { doc, updateDoc, getDoc } from "firebase/firestore";
import { db } from "@/app/firebase/config";
export async function updateFavourites(
  uid: string,
  add: boolean,
  movieId: number
) {
  if (uid) {
    const docRef = doc(db, "users", uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const favourites = docSnap.data().favourites;

      if (add) {
        favourites.unshift(movieId);
      }
      await updateDoc(docRef, {
        favourites: add
          ? favourites
          : favourites.filter((value: number) => value !== movieId),
      });

      console.log("Updated");
    } else {
      // docSnap.data() will be undefined in this case
      console.log("No such document!");
    }
  }
}
export async function updateBookmarks(
  uid: string,
  add: boolean,
  movieId: number
) {
  if (uid) {
    const docRef = doc(db, "users", uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const bookmarks = docSnap.data().bookmarks;

      if (add) {
        bookmarks.unshift(movieId);
      }
      await updateDoc(docRef, {
        bookmarks: add
          ? bookmarks
          : bookmarks.filter((value: number) => value !== movieId),
      });

      console.log("Updated");
    } else {
      // docSnap.data() will be undefined in this case
      console.log("No such document!");
    }
  }
}
