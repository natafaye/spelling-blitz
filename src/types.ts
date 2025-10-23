import type { Timestamp } from "firebase/firestore"

export type Game = {
    createdAt: Timestamp,
    words: string[]
    pangram: string
}