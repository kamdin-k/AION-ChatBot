import { useState } from "react";

export default function Home() {
  const [messages, setMessages] = useState<{ role: string; text: string }[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const currentInput = input;

    setMessages((prev) => [...prev, { role: "user", text: currentInput }]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("http://127.0.0.1:8000/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ message: currentInput })
      });

      const data = await res.json();

      setMessages((prev) => [
        ...prev,
        { role: "bot", text: data.reply || "Error" }
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "bot", text: "Error" }
      ]);
    }

    setLoading(false);
  };

  return (
    <div
      style={{
        maxWidth: 700,
        margin: "40px auto",
        fontFamily: "Arial, sans-serif",
        color: "#111"
      }}
    >
      <h1 style={{ marginBottom: 16 }}>AION ChatBot</h1>

      <div
        style={{
          border: "1px solid #ccc",
          minHeight: 320,
          padding: 16,
          background: "#f9f9f9",
          borderRadius: 8,
          overflowY: "auto"
        }}
      >
        {messages.length === 0 && <div>Start the conversation.</div>}

        {messages.map((msg, i) => (
          <div key={i} style={{ marginBottom: 12 }}>
            <b>{msg.role === "user" ? "You" : "Bot"}:</b> {msg.text}
          </div>
        ))}

        {loading && <div>Typing...</div>}
      </div>

      <div
        style={{
          marginTop: 16,
          display: "flex",
          gap: 12,
          alignItems: "center"
        }}
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message"
          style={{
            flex: 1,
            height: 44,
            padding: "0 12px",
            fontSize: 16,
            border: "2px solid #333",
            borderRadius: 6,
            background: "#fff",
            color: "#000"
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") sendMessage();
          }}
        />

        <button
          onClick={sendMessage}
          style={{
            height: 44,
            padding: "0 18px",
            fontSize: 16,
            border: "2px solid #333",
            borderRadius: 6,
            background: "#fff",
            color: "#000",
            cursor: "pointer"
          }}
        >
          Send
        </button>
      </div>
    </div>
  );
}
