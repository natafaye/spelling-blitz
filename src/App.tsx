import Game from "./Game";

export default function App() {
  return (
    <div className="absolute top-0 left-0 right-0 bottom-0 flex items-center justify-center p-4">
      <div className="w-full max-w-100 h-full flex flex-col overflow-hidden">
        <Game />
      </div>
    </div>
  )
}