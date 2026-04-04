"use client";

import { useState, useEffect } from "react";
import { useChat } from "@/lib/chat-context";
import { useAuth } from "@/lib/auth-context";
import ChatInterface from "./chat-interface";
import styles from "./conversation-list.module.css";

export default function ConversationList() {
  const { user } = useAuth();
  const { conversations, getUnreadCount } = useChat();
  const [selectedConversation, setSelectedConversation] = useState<any>(null);
  const [userConversations, setUserConversations] = useState<any[]>([]);

  if (!user) return null;

  // Get conversations for current user
  useEffect(() => {
    const userConvs = conversations.filter(
      (conv) => conv.buyerId === user.id || conv.sellerId === user.id
    );
    setUserConversations(userConvs);
  }, [conversations, user.id]);

  const handleSelectConversation = (conversation: any) => {
    setSelectedConversation(conversation);
  };

  if (selectedConversation) {
    const otherUserId = selectedConversation.buyerId === user.id 
      ? selectedConversation.sellerId 
      : selectedConversation.buyerId;
    const otherUserName = selectedConversation.buyerId === user.id 
      ? selectedConversation.sellerName 
      : selectedConversation.buyerName;

    return (
      <ChatInterface
        receiverId={otherUserId}
        receiverName={otherUserName}
        onClose={() => setSelectedConversation(null)}
      />
    );
  }

  return (
    <div className={styles.conversationListContainer}>
      <h3 className={styles.header}>💬 Messages</h3>
      {userConversations.length === 0 ? (
        <div className={styles.emptyState}>
          <p>No conversations yet</p>
        </div>
      ) : (
        <div className={styles.conversationsList}>
          {userConversations.map((conversation, idx) => {
            const otherUserId = conversation.buyerId === user.id 
              ? conversation.sellerId 
              : conversation.buyerId;
            const otherUserName = conversation.buyerId === user.id 
              ? conversation.sellerName 
              : conversation.buyerName;
            const unreadCount = conversation.unreadCount;

            return (
              <button
                key={idx}
                onClick={() => handleSelectConversation(conversation)}
                className={styles.conversationItem}
              >
                <div className={styles.conversationInfo}>
                  <h4>{otherUserName}</h4>
                  <p className={styles.preview}>
                    {conversation.lastMessage || "Start a conversation"}
                  </p>
                </div>
                {unreadCount > 0 && (
                  <span className={styles.unreadBadge}>{unreadCount}</span>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
