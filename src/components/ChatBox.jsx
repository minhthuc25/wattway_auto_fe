import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { api } from '../api.js'

const MAX_LENGTH = 300 // same limit as the API
const HIDDEN_ON = ['/checkout', '/admin'] // hide the chatbot on these pages (checkout for security, admin is not necessary)
// a link the assistant writes as [Vehicle Name](/vehicles/id)
const LINK = /\[([^\]]+)\]\((\/(?:vehicles\/\d+|cart|checkout|account|login|register)?)\)/g

// turns the links in a reply into router links, e.g. "[Nissan Leaf](/vehicles/4)" shows "Nissan Leaf" as a link
function withLinks(text) {
    const parts = []
    let end = 0 // where the previous link ended
    for (const match of text.matchAll(LINK)) {
        const [, linkText, path] = match
        parts.push(text.slice(end, match.index))
        parts.push(<Link key={match.index} to={path}>{linkText}</Link>)
        end = match.index + match[0].length
    }
    parts.push(text.slice(end))
    return parts
}

export default function ChatBox() {
    const [open, setOpen] = useState(false)
    const [messages, setMessages] = useState([])
    const [input, setInput] = useState('')
    const [waiting, setWaiting] = useState(false)
    const [history, setHistory] = useState([]) // a log of the last questions and answers, sent so follow-up questions make sense
    const { pathname } = useLocation()

    async function handleSubmit(e) {
        e.preventDefault()
        const text = input.trim()
        if (!text || waiting) {
            return
        }

        setMessages((current) => [...current, { from: 'user', text }])
        setInput('')
        setWaiting(true)
        try {
            const json = await api('POST', '/api/chat', { message: text, history })
            const reply = json.data.reply
            setMessages((current) => [...current, { from: 'bot', text: reply }])
            // only answered questions are remembered (errors are left out).
			// The API accepts the last 10 messages, with answers up to 3000 characters
            setHistory((current) => [...current, { from: 'user', text }, { from: 'bot', text: reply.slice(0, 3000) }].slice(-10))
        } catch (err) {
            setMessages((current) => [...current, { from: 'bot', text: err.message }])
        } finally {
            setWaiting(false)
        }
    }

    if (HIDDEN_ON.includes(pathname)) {
        return null
    }
    if (!open) {
        return <button onClick={() => setOpen(true)}>Ask assistant</button>
    }

    return (
        <section>
            <h3>WattWay Assistant</h3>
            {messages.map((message, index) => (
                <p key={index} style={{ whiteSpace: 'pre-line' }}>
                    <strong>{message.from === 'user' ? 'You' : 'WattWay Assistant'}:</strong>{' '}
                    {message.from === 'user' ? message.text : withLinks(message.text)}
                </p>
            ))}
            {waiting && <p><strong>WattWay Assistant:</strong> Thinking...</p>}
            <form onSubmit={handleSubmit}>
                <input value={input} maxLength={MAX_LENGTH} placeholder="Ask about our vehicles..." onChange={(e) => setInput(e.target.value)} />
                <button type="submit" disabled={waiting}>Send</button>
            </form>
            <button onClick={() => setOpen(false)}>Close</button>
        </section>
    )
}
