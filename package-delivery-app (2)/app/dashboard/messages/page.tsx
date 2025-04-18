"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { SendIcon, PaperclipIcon } from "lucide-react"

// Mock data for conversations
const conversations = [
  {
    id: 1,
    user: {
      name: "Sarah Johnson",
      avatar: "SJ",
    },
    lastMessage: "Is the package ready for pickup?",
    time: "2h ago",
    unread: true,
  },
  {
    id: 2,
    user: {
      name: "Michael Chen",
      avatar: "MC",
    },
    lastMessage: "I'll be at the airport by 3 PM",
    time: "5h ago",
    unread: true,
  },
  {
    id: 3,
    user: {
      name: "Emma Wilson",
      avatar: "EW",
    },
    lastMessage: "Package delivered successfully!",
    time: "1d ago",
    unread: false,
  },
  {
    id: 4,
    user: {
      name: "David Rodriguez",
      avatar: "DR",
    },
    lastMessage: "Can you send me the package dimensions?",
    time: "2d ago",
    unread: false,
  },
]

// Mock messages for the selected conversation
const mockMessages = [
  {
    id: 1,
    sender: "Sarah Johnson",
    content: "Hi there! I'm interested in carrying your package from New York to London.",
    time: "10:30 AM",
    isMe: false,
  },
  {
    id: 2,
    sender: "Me",
    content:
      "Hello Sarah! That's great to hear. The package is a small gift box, about 20x15x10 cm and weighs around 1kg.",
    time: "10:35 AM",
    isMe: true,
  },
  {
    id: 3,
    sender: "Sarah Johnson",
    content:
      "Perfect, I have space for that. I'm flying on May 15th and will arrive in London on the 16th. Would that work for you?",
    time: "10:40 AM",
    isMe: false,
  },
  {
    id: 4,
    sender: "Me",
    content: "Yes, that timeline works well for me. How much would you charge for this delivery?",
    time: "10:45 AM",
    isMe: true,
  },
  {
    id: 5,
    sender: "Sarah Johnson",
    content: "I can do it for $30. Is that acceptable?",
    time: "10:50 AM",
    isMe: false,
  },
  {
    id: 6,
    sender: "Me",
    content: "That sounds reasonable. When and where can we meet for the pickup?",
    time: "10:55 AM",
    isMe: true,
  },
  {
    id: 7,
    sender: "Sarah Johnson",
    content: "I can meet you at Central Park on May 14th around 2 PM. Does that work?",
    time: "11:00 AM",
    isMe: false,
  },
  {
    id: 8,
    sender: "Sarah Johnson",
    content: "Is the package ready for pickup?",
    time: "2:15 PM",
    isMe: false,
  },
]

export default function MessagesPage() {
  const [selectedConversation, setSelectedConversation] = useState(conversations[0])
  const [newMessage, setNewMessage] = useState("")

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      // In a real app, you would send the message to the backend
      console.log("Sending message:", newMessage)
      setNewMessage("")
    }
  }

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col">
      <h1 className="text-2xl font-bold mb-4">Messages</h1>

      <div className="flex flex-1 border rounded-lg overflow-hidden">
        {/* Conversation List */}
        <div className="w-1/3 border-r">
          <div className="p-3 border-b">
            <Input placeholder="Search conversations..." />
          </div>
          <div className="overflow-y-auto h-[calc(100%-3.5rem)]">
            {conversations.map((conversation) => (
              <div
                key={conversation.id}
                className={`p-3 flex items-center gap-3 cursor-pointer hover:bg-gray-50 ${
                  selectedConversation.id === conversation.id ? "bg-gray-50" : ""
                }`}
                onClick={() => setSelectedConversation(conversation)}
              >
                <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-800 font-medium">
                  {conversation.user.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{conversation.user.name}</span>
                    <span className="text-xs text-gray-500">{conversation.time}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <p className="text-sm text-gray-600 truncate">{conversation.lastMessage}</p>
                    {conversation.unread && <div className="w-2 h-2 rounded-full bg-emerald-500"></div>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Message Area */}
        <div className="flex-1 flex flex-col">
          {/* Conversation Header */}
          <div className="p-3 border-b flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-800 font-medium">
              {selectedConversation.user.avatar}
            </div>
            <div>
              <div className="font-medium">{selectedConversation.user.name}</div>
              <div className="text-xs text-gray-500">Package: Small Electronics Package</div>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {mockMessages.map((message) => (
              <div key={message.id} className={`flex ${message.isMe ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[70%] rounded-lg p-3 ${
                    message.isMe ? "bg-emerald-600 text-white" : "bg-gray-100 text-gray-800"
                  }`}
                >
                  <p>{message.content}</p>
                  <div className={`text-xs mt-1 ${message.isMe ? "text-emerald-100" : "text-gray-500"}`}>
                    {message.time}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Message Input */}
          <div className="p-3 border-t flex gap-2">
            <Button variant="outline" size="icon">
              <PaperclipIcon className="h-4 w-4" />
            </Button>
            <Input
              placeholder="Type a message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSendMessage()
                }
              }}
            />
            <Button className="bg-emerald-600 hover:bg-emerald-700" onClick={handleSendMessage}>
              <SendIcon className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
