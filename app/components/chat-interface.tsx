"use client";

import { useState, useRef, useEffect } from "react";
import { useChat } from "@/lib/chat-context";
import { useAuth } from "@/lib/auth-context";
import styles from "./chat-interface.module.css";

interface ChatInterfaceProps {
  receiverId: string;
  receiverName: string;
  onClose?: () => void;
}

export default function ChatInterface({ receiverId, receiverName, onClose }: ChatInterfaceProps) {
  const { user } = useAuth();
  const { sendMessage, getConversationMessages, markAsRead } = useChat();
  const [messages, setMessages] = useState<any[]>([]);
  const [messageInput, setMessageInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  if (!user) return null;

  // Create conversation ID
  const conversationId = [user.id, receiverId].sort().join("-");

  // Load messages when component mounts or receiverId changes
  useEffect(() => {
    const loadMessages = () => {
      const conversationMessages = getConversationMessages(conversationId);
      setMessages(conversationMessages);
      // Mark all messages for this user as read
      conversationMessages.forEach((msg) => {
        if (msg.receiverId === user.id && !msg.read) {
          markAsRead(msg.id);
        }
      });
      // Auto-scroll to bottom
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 0);
    };
    loadMessages();
  }, [receiverId, user.id, conversationId, getConversationMessages, markAsRead]);

  const handleSendMessage = async () => {
    if (!messageInput.trim()) return;

    setIsLoading(true);
    try {
      sendMessage(user.id, user.name || "User", receiverId, messageInput);
      setMessageInput("");
      // Load updated messages
      const updatedMessages = getConversationMessages(conversationId);
      setMessages(updatedMessages);
      // Auto-scroll to bottom
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 0);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className={styles.chatContainer}>
      <div className={styles.chatHeader}>
        <h3>💬 Chat with {receiverName}</h3>
        {onClose && (
          <button onClick={onClose} className={styles.closeBtn} aria-label="Close chat">
            ✕
          </button>
        )}
      </div>

      <div className={styles.messagesArea}>
        {messages.length === 0 ? (
          <div className={styles.emptyState}>
            <p>No messages yet. Start the conversation!</p>
          </div>
        ) : (
          messages.map((msg, idx) => (
            <div
              key={idx}
              className={`${styles.message} ${msg.senderId === user.id ? styles.sent : styles.received}`}
            >
              <div className={styles.messageBubble}>
                <p>{msg.message}</p>
                <span className={styles.timestamp}>
                  {new Date(msg.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </span>
                {msg.senderId === user.id && msg.read && (
                  <span className={styles.readReceipt}>✓✓</span>
                )}
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className={styles.inputArea}>
        <textarea
          value={messageInput}
          onChange={(e) => setMessageInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type your message..."
          rows={2}
          disabled={isLoading}
          className={styles.messageInput}
        />
        <button
          onClick={handleSendMessage}
          disabled={isLoading || !messageInput.trim()}
          className={styles.sendBtn}
        >
          {isLoading ? "Sending..." : "Send"}
        </button>
      </div>
    </div>
  );
}
