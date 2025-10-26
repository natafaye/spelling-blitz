import type { Timestamp } from "firebase/firestore"

export type Player = {
    name: string
    color: string
    ready: boolean
}

export type Game = {
    obscurityLevel: number
    numLetters: number
    minLength: number
    letters: string[]
    allWords: string[]
    maxPoints: number
    words: string[]
    players: Player[]
    createdAt: Timestamp,
    startedAt: Timestamp | null
}