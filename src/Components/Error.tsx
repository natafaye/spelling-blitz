import { faCircleExclamation } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

type Props = {
    message: string
}

export default function Error({ message }: Props) {
  return (
    <div className="text-center my-auto pb-10">
        <h2 className="text-3xl mb-5 text-rose-800">
            <FontAwesomeIcon icon={faCircleExclamation} className="me-1"/>
            Error
        </h2>
        <p className="mb-2">{message}</p>
        <p>Try refreshing the page</p>
    </div>
  )
}