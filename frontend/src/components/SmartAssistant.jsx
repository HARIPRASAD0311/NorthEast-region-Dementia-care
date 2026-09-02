import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Bot, Mic, Send, Sparkles, X } from "lucide-react";
import { useAccessibility } from "./AccessibilityControls.jsx";

const QUICK_ACTIONS = [
    { label: "Dashboard", path: "/dashboard", keywords: ["dashboard", "home", "main page"] },
    { label: "Assessment", path: "/assessment", keywords: ["assessment", "screening", "test"] },
    { label: "Activities", path: "/activities", keywords: ["activities", "games", "exercise", "practice"] },
    { label: "Daily Care", path: "/daily-care", keywords: ["daily care", "reminders", "care plan"] },
    { label: "Progress", path: "/progress", keywords: ["progress", "trend", "performance"] },
    { label: "Profile", path: "/profile", keywords: ["profile", "my details", "account"] },
    { label: "Caregiver", path: "/caregiver", keywords: ["caregiver", "care overview"] },
];

function normalize(text) {
    return text.toLowerCase().replace(/[^a-z0-9\s]/g, " ").replace(/\s+/g, " ").trim();
}

export default function SmartAssistant() {
    const navigate = useNavigate();
    const { say, voiceOn } = useAccessibility();
    const recognitionRef = useRef(null);

    const [open, setOpen] = useState(false);
    const [listening, setListening] = useState(false);
    const [input, setInput] = useState("");
    const [messages, setMessages] = useState([
        {
            id: 1,
            role: "bot",
            text: "Hi! I can help you with reminders, activities, progress, and navigation. Ask me to open a screen or say 'show my progress'.",
        },
    ]);

    useEffect(() => {
        return () => {
            recognitionRef.current?.stop();
        };
    }, []);

    const replyToMessage = (rawText) => {
        const text = normalize(rawText);
        const action = QUICK_ACTIONS.find(({ keywords }) =>
            keywords.some((keyword) => text.includes(keyword))
        );

        if (action) {
            navigate(action.path);
            const response = `Opening ${action.label}.`;
            if (voiceOn) say(response);
            return response;
        }

        if (text.includes("help") || text.includes("what can you do")) {
            const response = "I can open your dashboard, assessment, activities, daily care, progress, profile, and caregiver view. I can also read instructions aloud when voice guidance is on.";
            if (voiceOn) say(response);
            return response;
        }

        if (text.includes("reminder") || text.includes("care") || text.includes("schedule")) {
            navigate("/daily-care");
            const response = "Opening your daily care and reminders.";
            if (voiceOn) say(response);
            return response;
        }

        if (text.includes("activity") || text.includes("game")) {
            navigate("/activities");
            const response = "Opening your activities.";
            if (voiceOn) say(response);
            return response;
        }

        const fallback = "I can help you open your dashboard, assessment, progress, profile, or daily care. Try: 'open my daily care' or 'show my progress'.";
        if (voiceOn) say(fallback);
        return fallback;
    };

    const addMessage = (role, text) => {
        setMessages((prev) => [
            ...prev,
            {
                id: Date.now() + Math.random(),
                role,
                text,
            },
        ]);
    };

    const handleSend = (text) => {
        const message = text.trim();
        if (!message) return;

        addMessage("user", message);
        const reply = replyToMessage(message);
        addMessage("bot", reply);
        setInput("");
    };

    const startListening = () => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) {
            const msg = "Voice input is not supported in this browser.";
            addMessage("bot", msg);
            if (voiceOn) say(msg);
            return;
        }

        const recognition = new SpeechRecognition();
        recognition.lang = "en-IN";
        recognition.interimResults = false;

        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            setInput(transcript);
            handleSend(transcript);
        };

        recognition.onerror = () => {
            setListening(false);
        };

        recognition.onend = () => {
            setListening(false);
        };

        recognitionRef.current = recognition;
        setListening(true);
        recognition.start();
    };

    return (
        <div style={{ position: "fixed", right: 18, bottom: 90, zIndex: 45 }}>
            {open && (
                <div
                    style={{
                        width: 340,
                        maxWidth: "calc(100vw - 24px)",
                        background: "rgba(20, 36, 31, 0.97)",
                        border: "1px solid rgba(255,255,255,0.08)",
                        borderRadius: 18,
                        boxShadow: "0 14px 38px rgba(0,0,0,0.28)",
                        overflow: "hidden",
                        color: "#f4efe7",
                    }}
                >
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            padding: "12px 14px",
                            borderBottom: "1px solid rgba(255,255,255,0.08)",
                            background: "rgba(122, 172, 142, 0.12)",
                        }}
                    >
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            <div style={{ width: 28, height: 28, borderRadius: "50%", background: "rgba(94,196,138,0.2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                <Bot size={16} color="#9ae6b4" />
                            </div>
                            <div>
                                <div style={{ fontWeight: 700, fontSize: 14 }}>Limbo Assistant</div>
                                <div style={{ fontSize: 11, color: "#d9d1b9" }}>Voice + navigation help</div>
                            </div>
                        </div>
                        <button
                            onClick={() => setOpen(false)}
                            style={{ background: "transparent", border: "none", cursor: "pointer", color: "#f4efe7" }}
                            aria-label="Close assistant"
                        >
                            <X size={18} />
                        </button>
                    </div>

                    <div style={{ maxHeight: 300, overflowY: "auto", padding: 12, display: "flex", flexDirection: "column", gap: 10 }}>
                        {messages.map((message) => (
                            <div
                                key={message.id}
                                style={{
                                    alignSelf: message.role === "user" ? "flex-end" : "flex-start",
                                    maxWidth: "82%",
                                    background: message.role === "user" ? "rgba(154, 230, 180, 0.14)" : "rgba(255,255,255,0.06)",
                                    border: "1px solid rgba(255,255,255,0.06)",
                                    borderRadius: 12,
                                    padding: "8px 10px",
                                    fontSize: 13,
                                    lineHeight: 1.5,
                                }}
                            >
                                {message.text}
                            </div>
                        ))}
                    </div>

                    <div style={{ padding: "10px 12px 12px", borderTop: "1px solid rgba(255,255,255,0.08)" }}>
                        <div style={{ display: "flex", gap: 8, marginBottom: 8, flexWrap: "wrap" }}>
                            {QUICK_ACTIONS.slice(0, 4).map((action) => (
                                <button
                                    key={action.label}
                                    onClick={() => { setOpen(true); handleSend(`open ${action.label}`); }}
                                    style={{
                                        background: "rgba(255,255,255,0.04)",
                                        border: "1px solid rgba(255,255,255,0.08)",
                                        color: "#f4efe7",
                                        borderRadius: 999,
                                        padding: "6px 10px",
                                        fontSize: 11,
                                        cursor: "pointer",
                                    }}
                                >
                                    {action.label}
                                </button>
                            ))}
                        </div>

                        <div style={{ display: "flex", gap: 8 }}>
                            <input
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") handleSend(input);
                                }}
                                placeholder="Ask me to open a feature"
                                style={{
                                    flex: 1,
                                    borderRadius: 10,
                                    border: "1px solid rgba(255,255,255,0.08)",
                                    background: "rgba(255,255,255,0.03)",
                                    color: "#f4efe7",
                                    padding: "10px 12px",
                                    outline: "none",
                                }}
                            />
                            <button
                                onClick={() => startListening()}
                                style={{
                                    width: 42,
                                    height: 42,
                                    borderRadius: 10,
                                    border: "none",
                                    background: listening ? "rgba(250, 204, 21, 0.2)" : "rgba(154, 230, 180, 0.12)",
                                    color: "#f4efe7",
                                    cursor: "pointer",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                }}
                                aria-label="Use voice input"
                            >
                                <Mic size={16} />
                            </button>
                            <button
                                onClick={() => handleSend(input)}
                                style={{
                                    width: 42,
                                    height: 42,
                                    borderRadius: 10,
                                    border: "none",
                                    background: "rgba(154, 230, 180, 0.18)",
                                    color: "#f4efe7",
                                    cursor: "pointer",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                }}
                                aria-label="Send message"
                            >
                                <Send size={16} />
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <button
                onClick={() => setOpen((prev) => !prev)}
                style={{
                    width: 60,
                    height: 60,
                    borderRadius: "50%",
                    border: "none",
                    background: "linear-gradient(135deg, #2c4a3e, #1a4d55)",
                    boxShadow: "0 12px 28px rgba(20, 36, 31, 0.35)",
                    color: "#f4efe7",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                }}
                aria-label="Open assistant"
            >
                <div style={{ position: "relative" }}>
                    <Sparkles size={24} />
                </div>
            </button>
        </div>
    );
}
