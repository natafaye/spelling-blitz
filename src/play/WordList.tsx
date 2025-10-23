type Props = {
    words: string[]
}

export default function WordList({ words }: Props) {
  return (
    <div className="uppercase bg-amber-50 rounded p-3 border border-amber-300">
        {words.map(word => <div key={word}>{ word }</div>)}
    </div>
  )
}