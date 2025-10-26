import { doc, getDoc } from "firebase/firestore";
import { db } from "../shared/firebase";

export const existsGameWithId = async (id: string) => {
  const docSnapshot = await getDoc(doc(db, "games", id));
  return docSnapshot.exists();
};
