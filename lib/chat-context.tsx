"use client";

import { createContext, useContext, useState, ReactNode, useEffect } from "react";

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  receiverId: string;
  message: string;
  timestamp: string;
  read: boolean;
}

export interface Conversation {
  id: string;
  buyerId: string;
  buyerName: string;
  sellerId: string;
  sellerName: string;
  productId?: string;
  productName?: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
}

interface ChatContextType {
  conversations: Conversation[];
  messages: ChatMessage[];
  sendMessage: (senderId: string, senderName: string, receiverId: string, message: string, productId?: string, productName?: string) => void;
  getConversation: (conversationId: string) => Conversation | null;
  getConversationMessages: (conversationId: string) => ChatMessage[];
  markAsRead: (messageId: string) => void;
  getUnreadCount: (userId: string) => number;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

const CONVERSATIONS_KEY = "chat_conversations";
const MESSAGES_KEY = "chat_messages";

export function ChatProvider({ children }: { children: ReactNode }) {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    const storedConversations = localStorage.getItem(CONVERSATIONS_KEY);
    const storedMessages = localStorage.getItem(MESSAGES_KEY);

    if (storedConversations) {
      try {
        setConversations(JSON.parse(storedConversations));
      } catch (e) {
        console.error("Failed to parse conversations:", e);
      }
    }

    if (storedMessages) {
      try {
        setMessages(JSON.parse(storedMessages));
      } catch (e) {
        console.error("Failed to parse messages:", e);
      }
    }

    setIsHydrated(true);
  }, []);

  const sendMessage = (
    senderId: string,
    senderName: string,
    receiverId: string,
    message: string,
    productId?: string,
    productName?: string
  ) => {
    const newMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      senderId,
      senderName,
      receiverId,
      message,
      timestamp: new Date().toISOString(),
      read: false,
    };

    const updatedMessages = [...messages, newMessage];
    setMessages(updatedMessages);
    localStorage.setItem(MESSAGES_KEY, JSON.stringify(updatedMessages));

    // Create or update conversation
    const conversationId = [senderId, receiverId].sort().join("-");
    let conversation = conversations.find((c) => c.id === conversationId);

    if (!conversation) {
      // Determine if sender is buyer or seller
      const isSenderBuyer = !senderId.startsWith("seller-");
      conversation = {
        id: conversationId,
        buyerId: isSenderBuyer ? senderId : receiverId,
        buyerName: isSenderBuyer ? senderName : receiverId,
        sellerId: isSenderBuyer ? receiverId : senderId,
        sellerName: isSenderBuyer ? receiverId : senderName,
        productId,
        productName,
        lastMessage: message,
        lastMessageTime: new Date().toISOString(),
        unreadCount: 1,
      };

      const updatedConversations = [...conversations, conversation];
      setConversations(updatedConversations);
      localStorage.setItem(CONVERSATIONS_KEY, JSON.stringify(updatedConversations));
    } else {
      // Update existing conversation
      const updatedConversations = conversations.map((c) =>
        c.id === conversationId
          ? {
              ...c,
              lastMessage: message,
              lastMessageTime: new Date().toISOString(),
              unreadCount: c.unreadCount + 1,
            }
          : c
      );
      setConversations(updatedConversations);
      localStorage.setItem(CONVERSATIONS_KEY, JSON.stringify(updatedConversations));
    }
  };

  const getConversation = (conversationId: string): Conversation | null => {
    return conversations.find((c) => c.id === conversationId) || null;
  };

  const getConversationMessages = (conversationId: string): ChatMessage[] => {
    return messages.filter((m) => {
      const msgConvId = [m.senderId, m.receiverId].sort().join("-");
      return msgConvId === conversationId;
    });
  };

  const markAsRead = (messageId: string) => {
    const updatedMessages = messages.map((m) =>
      m.id === messageId ? { ...m, read: true } : m
    );
    setMessages(updatedMessages);
    localStorage.setItem(MESSAGES_KEY, JSON.stringify(updatedMessages));
  };

  const getUnreadCount = (userId: string): number => {
    return messages.filter((m) => m.receiverId === userId && !m.read).length;
  };

  if (!isHydrated) {
    return <div>{children}</div>;
  }

  return (
    <ChatContext.Provider
      value={{
        conversations,
        messages,
        sendMessage,
        getConversation,
        getConversationMessages,
        markAsRead,
        getUnreadCount,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  const context = useContext(ChatContext);

  if (context === undefined) {
    return {
      conversations: [],
      messages: [],
      sendMessage: () => {},
      getConversation: () => null,
      getConversationMessages: () => [],
      markAsRead: () => {},
      getUnreadCount: () => 0,
    };
  }

  return context;
}
