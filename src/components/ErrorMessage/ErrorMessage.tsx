import css from './ErrorMessage.module.css'

const errorMessages: Record<string, string> = {
  backend: "There was an error, please try again...",
  request: "Nothing found for your request.",
}
type ErrorKey = keyof typeof errorMessages;
interface ErrorMessageProps {
  value: ErrorKey;
}

export default function ErrorMessage({value}:ErrorMessageProps) {
  return (
    <p className={css.text}>
      {errorMessages[value]}
    </p>
  )
}
