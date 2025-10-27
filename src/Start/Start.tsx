import CreateForm from "./CreateForm";
import JoinForm from "./JoinForm";

type Props = {
    playerId: string
    gameIdHistory: string[]
    onJoin: (id: string) => void
}

export default function Start({ playerId, gameIdHistory, onJoin }: Props) {

    return (
        <div className="my-auto">
            <h1 className="text-5xl text-center mb-10">🐝Spelling Blitz</h1>
            <CreateForm onJoin={onJoin} playerId={playerId} />
            <div className="flex items-center">
                <hr className="flex-1" />
                <p className="p-4 text-xl text-center">OR</p>
                <hr className="flex-1" />
            </div>
            <JoinForm onJoin={onJoin} gameIdHistory={gameIdHistory} />
        </div>
    )
}