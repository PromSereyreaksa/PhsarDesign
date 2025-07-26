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
// Note: Uncomment these when messages API is implemented
// import { fetchUserConversations, fetchConversation, sendMessage } from "../../store/actions"

export default function Messages() {
  const dispatch = useDispatch()
  const { user } = useSelector((state) => state.auth)
  const { conversations: apiConversations = [], messages: apiMessages = [], isLoading, error } = useSelector((state) => state.api)
  
  const [selectedConversation, setSelectedConversation] = useState(1)
  const [newMessage, setNewMessage] = useState("")
  const [searchQuery, setSearchQuery] = useState("")

  // TODO: Uncomment when messages API is implemented
  // useEffect(() => {
  //   const loadConversations = async () => {
  //     if (user) {
  //       try {
  //         await dispatch(fetchUserConversations(user.id))
  //       } catch (error) {
  //         console.error('Error loading conversations:', error)
  //       }
  //     }
  //   }
  //   loadConversations()
  // }, [dispatch, user])  // Mock data until backend API is ready
  // TODO: Replace with apiConversations and apiMessages when backend is ready
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
    {
      id: 3,
      name: "Emily Rodriguez",
      role: "Content Writer",
      avatar: "/placeholder.svg?height=40&width=40",
      lastMessage: "I'll have the first draft ready by tomorrow",
      timestamp: "3 hours ago",
      unread: 1,
      online: true,
      project: "Blog Content",
    },
    {
      id: 4,
      name: "David Kim",
      role: "Digital Marketer",
      avatar: "/placeholder.svg?height=40&width=40",
      lastMessage: "The campaign is performing well. Here's the report.",
      timestamp: "1 day ago",
      unread: 0,
      online: false,
      project: "Social Media Campaign",
    },
  ]

  const messages = [
    {
      id: 1,
      sender: "Sarah Johnson",
      content:
        "Hi! I've started working on your e-commerce project. I've set up the basic structure and would love to get your feedback on the initial design.",
      timestamp: "10:30 AM",
      isOwn: false,
    },
    {
      id: 2,
      sender: "You",
      content:
        "That looks great! I really like the clean layout. Could you add a search functionality to the product catalog?",
      timestamp: "10:45 AM",
      isOwn: true,
    },
    {
      id: 3,
      sender: "Sarah Johnson",
      content:
        "I'll implement the search feature with filters for categories and price ranges. Should be ready for review by tomorrow.",
      timestamp: "10:47 AM",
      isOwn: false,
    },
    {
      id: 4,
      sender: "You",
      content: "Perfect! Also, please make sure the checkout process is mobile-friendly.",
      timestamp: "11:00 AM",
      isOwn: true,
    },
    {
      id: 5,
      sender: "Sarah Johnson",
      content:
        "I've completed the initial setup. Could you please review? The mobile checkout is fully responsive and tested on multiple devices.",
      timestamp: "2:15 PM",
      isOwn: false,
    },
  ]

  const currentConversation = conversations.find((conv) => conv.id === selectedConversation)

  const handleSendMessage = async (e) => {
    e.preventDefault()
    if (newMessage.trim()) {
      try {
        // TODO: Uncomment when messages API is implemented
        // await dispatch(sendMessage({
        //   content: newMessage,
        //   recipientId: selectedConversation,
        //   senderId: user.id
        // }))
        
        // Mock implementation for now
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

        {!isLoading && (
          <div className="bg-white rounded-lg shadow-sm border overflow-hidden" style={{ height: "calc(100vh - 200px)" }}>
            <div className="flex h-full">
            {/* Conversations Sidebar */}
            <div className="w-1/3 border-r border-gray-200 flex flex-col">
              {/* Search */}
              <div className="p-4 border-b border-gray-200">
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

              {/* Conversations List */}
              <div className="flex-1 overflow-y-auto">
                {conversations.map((conversation) => (
                  <div
                    key={conversation.id}
                    onClick={() => setSelectedConversation(conversation.id)}
                    className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 ${
                      selectedConversation === conversation.id ? "bg-blue-50 border-blue-200" : ""
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <div className="relative">
                        <Avatar>
                          <AvatarImage src={conversation.avatar || "/placeholder.svg"} alt={conversation.name} />
                          <AvatarFallback>
                            {conversation.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        {conversation.online && (
                          <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 border-2 border-white rounded-full"></div>
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="text-sm font-medium text-gray-900 truncate">{conversation.name}</p>
                            <p className="text-xs text-gray-500">{conversation.role}</p>
                          </div>
                          <div className="flex flex-col items-end">
                            <p className="text-xs text-gray-500">{conversation.timestamp}</p>
                            {conversation.unread > 0 && (
                              <Badge className="bg-blue-600 text-white text-xs mt-1">{conversation.unread}</Badge>
                            )}
                          </div>
                        </div>

                        <p className="text-sm text-gray-600 truncate mt-1">{conversation.lastMessage}</p>

                        <Badge variant="outline" className="text-xs mt-2">
                          {conversation.project}
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 flex flex-col">
              {currentConversation ? (
                <>
                  {/* Chat Header */}
                  <div className="p-4 border-b border-gray-200 bg-white">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center space-x-3">
                        <div className="relative">
                          <Avatar>
                            <AvatarImage
                              src={currentConversation.avatar || "/placeholder.svg"}
                              alt={currentConversation.name}
                            />
                            <AvatarFallback>
                              {currentConversation.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          {currentConversation.online && (
                            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 border-2 border-white rounded-full"></div>
                          )}
                        </div>
                        <div>
                          <h3 className="text-lg font-medium text-gray-900">{currentConversation.name}</h3>
                          <p className="text-sm text-gray-500">
                            {currentConversation.online ? "Online" : "Last seen 2 hours ago"} •{" "}
                            {currentConversation.role}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
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

                    <div className="mt-2">
                      <Badge variant="outline">{currentConversation.project}</Badge>
                    </div>
                  </div>

                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {messages.map((message) => (
                      <div key={message.id} className={`flex ${message.isOwn ? "justify-end" : "justify-start"}`}>
                        <div
                          className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                            message.isOwn ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-900"
                          }`}
                        >
                          <p className="text-sm">{message.content}</p>
                          <p className={`text-xs mt-1 ${message.isOwn ? "text-blue-100" : "text-gray-500"}`}>
                            {message.timestamp}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Message Input */}
                  <div className="p-4 border-t border-gray-200 bg-white">
                    <form onSubmit={handleSendMessage} className="flex items-end space-x-2">
                      <Button type="button" variant="ghost" size="sm">
                        <Paperclip className="h-4 w-4" />
                      </Button>
                      <div className="flex-1">
                        <Textarea
                          placeholder="Type your message..."
                          value={newMessage}
                          onChange={(e) => setNewMessage(e.target.value)}
                          className="min-h-[40px] max-h-32 resize-none"
                          onKeyPress={(e) => {
                            if (e.key === "Enter" && !e.shiftKey) {
                              e.preventDefault()
                              handleSendMessage(e)
                            }
                          }}
                        />
                      </div>
                      <Button type="submit" disabled={!newMessage.trim()}>
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
        )}
      </div>

      <Footer />
    </div>
  )
}
