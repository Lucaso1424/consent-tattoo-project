export function Button({ text, action }: {text: string, action?: () => void ;}) {
    return <button onClick={action}>{text}</button>
}