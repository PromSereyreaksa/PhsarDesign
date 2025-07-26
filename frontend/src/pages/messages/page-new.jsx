"use client"

import { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import Navbar from "../../components/layout/Navbar"
import Footer from "../../components/layout/Footer"
import { Search, Send, Paperclip, MoreVertical, Phone, Video, Loader2 } from "lucide-react"
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { Textarea } from "../../components/ui/textarea"
import { Badge } from "../../components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "../../components/ui/avatar"

export default function Messages() {
  const dispatch = useDispatch()
  const { user } = useSelector((state) => state.auth)
  const { isLoading, error } = useSelector((state) => state.api)
  
  const [selectedConversation, setSelectedConversation] = useState(1)
  const [newMessage, setNewMessage] = useState("")
  const [searchQuery, setSearchQuery] = useState("")

  // Mock data until backend API is ready
  const conversations = [
    {
      id: 1,
      name: "Sarah Johnson",
      role: "Full Stack Developer",
      avatar: "/placeholder.svg?height=40&width=40",
      lastMessage: "I've completed the initial setup. Could you please review?",
      timestamp: "2 min ago",
      unread: 2,
      online: true,
      project: "E-commerce Website",
    },
    {
      id: 2,
      name: "Mike Chen",
      role: "UI/UX Designer",
      avatar: "/placeholder.svg?height=40&width=40",
      lastMessage: "Here are the wireframes for your review",
      timestamp: "1 hour ago",
      unread: 0,
      online: false,
      project: "Mobile App Design",
    },
  ]

  const messages = [
    {
      id: 1,
      sender: "Sarah Johnson",
      content: "Hi! I've started working on your e-commerce project.",
      timestamp: "10:30 AM",
      isOwn: false,
    },
    {
      id: 2,
      sender: "You",
      content: "That looks great! I really like the clean layout.",
      timestamp: "10:45 AM",
      isOwn: true,
    },
  ]

  const handleSendMessage = async (e) => {
    e.preventDefault()
    if (newMessage.trim()) {
      try {
        // TODO: Implement real message sending
        console.log("Sending message:", newMessage)
        setNewMessage("")
      } catch (error) {
        console.error('Error sending message:', error)
      }
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            <span className="ml-2 text-gray-600">Loading conversations...</span>
          </div>
        )}

        {/* Messages Interface */}
        {!isLoading && (
          <div className="bg-white rounded-lg shadow-sm border overflow-hidden" style={{ height: "calc(100vh - 200px)" }}>
            <div className="flex h-full">
              {/* Conversations Sidebar */}
              <div className="w-1/3 border-r border-gray-200 flex flex-col">
                <div className="p-4 border-b border-gray-200">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Messages</h2>
                  <div className="relative">
                    <Input
                      type="text"
                      placeholder="Search conversations..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto">
                  {conversations.map((conversation) => (
                    <div
                      key={conversation.id}
                      onClick={() => setSelectedConversation(conversation.id)}
                      className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 $
                        selectedConversation === conversation.id ? "bg-blue-50 border-blue-200" : ""
                      }`}
                    >
                      <div className="flex items-start space-x-3">
                        <div className="relative">
                          <Avatar>
                            <AvatarImage src={conversation.avatar} alt={conversation.name} />
                            <AvatarFallback>{conversation.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          {conversation.online && (
                            <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start">
                            <p className="text-sm font-medium text-gray-900 truncate">{conversation.name}</p>
                            <span className="text-xs text-gray-500">{conversation.timestamp}</span>
                          </div>
                          <p className="text-xs text-gray-500 mb-1">{conversation.role}</p>
                          <p className="text-sm text-gray-600 truncate">{conversation.lastMessage}</p>
                          <div className="flex justify-between items-center mt-2">
                            <Badge variant="outline" className="text-xs">
                              {conversation.project}
                            </Badge>
                            {conversation.unread > 0 && (
                              <span className="bg-blue-600 text-white text-xs rounded-full px-2 py-1 min-w-[20px] text-center">
                                {conversation.unread}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Chat Area */}
              <div className="flex-1 flex flex-col">
                {selectedConversation ? (
                  <>
                    {/* Chat Header */}
                    <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                      <div className="flex items-center space-x-3">
                        <Avatar>
                          <AvatarImage src="/placeholder.svg" alt="User" />
                          <AvatarFallback>SJ</AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-medium text-gray-900">Sarah Johnson</h3>
                          <p className="text-sm text-gray-500">Full Stack Developer</p>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="ghost" size="sm">
                          <Phone className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Video className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                      {messages.map((message) => (
                        <div
                          key={message.id}
                          className={`flex ${message.isOwn ? "justify-end" : "justify-start"}`}
                        >
                          <div
                            className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                              message.isOwn
                                ? "bg-blue-600 text-white"
                                : "bg-gray-100 text-gray-900"
                            }`}
                          >
                            <p className="text-sm">{message.content}</p>
                            <p
                              className={`text-xs mt-1 ${
                                message.isOwn ? "text-blue-100" : "text-gray-500"
                              }`}
                            >
                              {message.timestamp}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Message Input */}
                    <div className="p-4 border-t border-gray-200">
                      <form onSubmit={handleSendMessage} className="flex space-x-2">
                        <Button type="button" variant="ghost" size="sm">
                          <Paperclip className="h-4 w-4" />
                        </Button>
                        <div className="flex-1">
                          <Textarea
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            placeholder="Type your message..."
                            className="resize-none"
                            rows={1}
                          />
                        </div>
                        <Button
                          type="submit"
                          disabled={!newMessage.trim()}
                          className="bg-blue-600 hover:bg-blue-700"
                        >
                          <Send className="h-4 w-4" />
                        </Button>
                      </form>
                    </div>
                  </>
                ) : (
                  <div className="flex-1 flex items-center justify-center">
                    <div className="text-center">
                      <h3 className="text-lg font-medium text-gray-900 mb-2">Select a conversation</h3>
                      <p className="text-gray-500">Choose a conversation from the sidebar to start messaging</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  )
}
