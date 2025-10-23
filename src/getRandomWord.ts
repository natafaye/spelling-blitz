const words = ["banana", "antelope", "hello", "purple", "orange", "cantaloupe"]

export const getRandomWord = () => {
    return words[Math.floor(Math.random() * words.length)]
}