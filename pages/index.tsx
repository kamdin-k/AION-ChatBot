import Head from 'next/head'
import { useState } from 'react'
import styles from '../styles/Home.module.css'

type Sender = 'user' | 'bot'

type Message = {
  id: number
  sender: Sender
  text: string
  timestamp: string
}

const BOT_NAME = 'Neutron'
const BOT_TAGLINE = 'Your AI hangout buddy for smart, friendly conversations'

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      sender: 'bot',
      text:
        "Hey, I’m Neutron 🤖✨\nThink of me as your smart hangout buddy: half lab-brain, half chill coffee chat.\nWhat do you feel like talking about first?",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ])
  const [input, setInput] = useState('')
  const [isThinking, setIsThinking] = useState(false)

  const handleSend = (event: React.FormEvent) => {
    event.preventDefault()
    const trimmed = input.trim()
    if (!trimmed || isThinking) return

    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

    const userMessage: Message = {
      id: Date.now(),
      sender: 'user',
      text: trimmed,
      timestamp
    }

    setMessages(previous => [...previous, userMessage])
    setInput('')
    setIsThinking(true)

    setTimeout(() => {
      const replyText = generateBotReply(trimmed)
      const botMessage: Message = {
        id: Date.now() + 1,
        sender: 'bot',
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit'
        })
      }
      setMessages(previous => [...previous, botMessage])
      setIsThinking(false)
    }, 800)
  }

  return (
    <>
      <Head>
        <title>Neutron AI Hangout</title>
        <meta name="description" content="Neutron – your friendly AI hangout buddy" />
      </Head>
      <div className={styles.appRoot}>
        <div className={styles.chatShell}>
          <header className={styles.chatHeader}>
            <div className={styles.chatAvatar}>
              <span>N</span>
            </div>
            <div>
              <h1 className={styles.chatTitle}>{BOT_NAME}</h1>
              <p className={styles.chatSubtitle}>{BOT_TAGLINE}</p>
            </div>
          </header>

          <main className={styles.chatMain}>
            <div className={styles.chatHint}>
              💡 You can ask about study plans, career ideas, tech questions, or just hang out and talk.
            </div>

            <div className={styles.chatMessages}>
              {messages.map(message => {
                const lines = message.text.split('\n')
                const isUser = message.sender === 'user'
                return (
                  <div
                    key={message.id}
                    className={`${styles.bubbleRow} ${
                      isUser ? styles.bubbleRowRight : styles.bubbleRowLeft
                    }`}
                  >
                    {!isUser && (
                      <div className={styles.miniAvatar}>
                        <span>N</span>
                      </div>
                    )}
                    <div
                      className={
                        isUser
                          ? `${styles.chatBubble} ${styles.chatBubbleUser}`
                          : `${styles.chatBubble} ${styles.chatBubbleBot}`
                      }
                    >
                      <p className={styles.bubbleText}>
                        {lines.map((line, index) => (
                          <span key={index}>
                            {line}
                            {index !== lines.length - 1 && <br />}
                          </span>
                        ))}
                      </p>
                      <span className={styles.bubbleMeta}>
                        {isUser ? 'You' : BOT_NAME} · {message.timestamp}
                      </span>
                    </div>
                  </div>
                )
              })}

              {isThinking && (
                <div className={`${styles.bubbleRow} ${styles.bubbleRowLeft}`}>
                  <div className={styles.miniAvatar}>
                    <span>N</span>
                  </div>
                  <div className={`${styles.chatBubble} ${styles.chatBubbleBot}`}>
                    <p className={`${styles.bubbleText} ${styles.typing}`}>
                      Running a quick brain blast
                      <span className={styles.dot}>.</span>
                      <span className={styles.dot}>.</span>
                      <span className={styles.dot}>.</span>
                    </p>
                  </div>
                </div>
              )}
            </div>
          </main>

          <form className={styles.chatInputBar} onSubmit={handleSend}>
            <input
              type="text"
              placeholder="Type a message to Neutron…"
              value={input}
              onChange={event => setInput(event.target.value)}
            />
            <button type="submit" disabled={!input.trim() || isThinking}>
              {isThinking ? '...' : 'Send'}
            </button>
          </form>
        </div>
      </div>
    </>
  )
}

function generateBotReply(userText: string): string {
  const text = userText.toLowerCase()

  if (text.includes('study') || text.includes('exam') || text.includes('test') || text.includes('homework')) {
    return (
      'Study mode activated 📚🧠\n' +
      'Tell me one subject and how much time you have. I will help you break it into clear, focused blocks so it feels manageable instead of overwhelming.'
    )
  }

  if (text.includes('project') || text.includes('idea') || text.includes('startup')) {
    return (
      'Nice, you are in idea-lab mode 🚀\n' +
      'Tell me in one or two sentences what you want to build. I will help you turn it into a simple, professional plan with concrete next steps.'
    )
  }

  if (text.includes('tired') || text.includes('burnout') || text.includes('stress') || text.includes('stressed')) {
    return (
      'You are not a robot, even if you hang out with one 🫂\n' +
      'Let us do a quick reset: inhale for 4, hold for 4, exhale for 4.\n' +
      'Then tell me one small win we can create together in the next 20 minutes.'
    )
  }

  if (text.includes('plan') || text.includes('schedule') || text.includes('day') || text.includes('week')) {
    return (
      'Planning time, my favorite kind of experiment 🧪\n' +
      'Tell me your top three priorities for today or this week, and how many hours you honestly have. I will help you design a realistic, intelligent plan.'
    )
  }

  if (text.includes('career') || text.includes('job') || text.includes('resume') || text.includes('co-op')) {
    return (
      'Career radar online 🎯\n' +
      'Tell me what role you are aiming for and what you have done so far. I can help you with positioning, wording, and next actions to move closer to that role.'
    )
  }

  return (
    'I like how you think ✨\n' +
    'If you want, we can treat your life like a level-up game: habits, skills, and projects become XP.\n' +
    'What is one area you would like to level up first: tech skills, discipline, creativity, confidence, or something else?'
  )
}
