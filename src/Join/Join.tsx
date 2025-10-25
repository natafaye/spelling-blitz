import CreateForm from "./CreateForm";
import JoinForm from "./JoinForm";

type Props = {
    onJoin: (id: string) => void
}

export default function Join({ onJoin }: Props) {

    return (
        <div className="flex items-center justify-center h-svh p-4">
            <div>
                <h1 className="text-5xl text-center mb-10">🐝Spelling Blitz</h1>
                <CreateForm onJoin={onJoin}/>
                <p className="p-4 text-xl text-center">----- or -----</p>
                <JoinForm onJoin={onJoin}/>
            </div>
        </div>
    )
}