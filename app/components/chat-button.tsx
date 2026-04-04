"use client";

import { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import ChatInterface from "./chat-interface";
import styles from "./chat-button.module.css";

interface ChatButtonProps {
  recipientId: string;
  recipientName: string;
  variant?: "primary" | "secondary";
}

export default function ChatButton({ recipientId, recipientName, variant = "primary" }: ChatButtonProps) {
  const { user } = useAuth();
  const [showChat, setShowChat] = useState(false);

  if (!user) return null;

  // Don't show chat button if user is chatting with themselves
  if (user.id === recipientId) return null;

  return (
    <>
      <button
        onClick={() => setShowChat(true)}
        className={`${styles.chatButton} ${styles[variant]}`}
      >
        💬 Chat with {recipientName}
      </button>

      {showChat && (
        <div className={styles.chatModal}>
          <div className={styles.chatOverlay} onClick={() => setShowChat(false)} />
          <ChatInterface
            receiverId={recipientId}
            receiverName={recipientName}
            onClose={() => setShowChat(false)}
          />
        </div>
      )}
    </>
  );
}
