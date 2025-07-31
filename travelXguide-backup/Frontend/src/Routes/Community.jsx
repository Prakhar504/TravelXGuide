import { useEffect, useState, useContext, useRef } from "react";
import { AppContext } from "../Context/AppContext.jsx";
import { socket } from "../socket/socket";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaPaperPlane, FaSmile, FaArrowLeft, FaEllipsisV } from "react-icons/fa";
import { IoMdSend } from "react-icons/io";
import EmojiPicker from "emoji-picker-react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Swal from 'sweetalert2';

export default function Community() {
  const { userData, backendUrl } = useContext(AppContext);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState(0);
  const navigate = useNavigate();
  const groupId = "travel-group";
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  let typingTimeout = useRef(null);

  useEffect(() => {
    if (!userData) {
      Swal.fire({
        icon: "error",
        title: "Access Denied",
        text: "You must be logged in to access the community chat",
        confirmButtonText: "Go to Login",
        background: "#1a1a2e",
        color: "#ffffff",
        confirmButtonColor: "#4f46e5",
        allowOutsideClick: false
      }).then((result) => {
        if (result.isConfirmed) {
          navigate("/signup");
        }
      });
      return;
    }

    const fetchMessages = async () => {
      try {
        const { data } = await axios.get(`${backendUrl}/api/chat/messages/${groupId}`);
        if (data.success) {
          setMessages(data.messages);
        }
      } catch (error) {
        console.error("Failed to fetch messages", error);
        toast.error("Failed to load chat history", {
          position: "top-right",
          theme: "colored",
        });
      }
    };

    fetchMessages();

    // Track online users
    socket.on("onlineUsers", (count) => {
      console.log("📊 Online users count received:", count);
      setOnlineUsers(count);
    });

    return () => {
      socket.off("onlineUsers");
    };
  }, [backendUrl, userData, navigate]);

  useEffect(() => {
    if (!userData) return;

    socket.on("receiveMessage", (msg) => {
      setMessages((prev) => {
        const isDuplicate = prev.some(m => m.createdAt === msg.createdAt && m.senderId === msg.senderId);
        return isDuplicate ? prev : [...prev, msg];
      });
      scrollToBottom();
    });
    
    socket.on("userTyping", ({ userName, isTyping }) => {
      if (userName !== userData?.name) {
        setIsTyping(isTyping);
        if (isTyping) {
          clearTimeout(typingTimeout.current);
          typingTimeout.current = setTimeout(() => setIsTyping(false), 2000);
        }
      }
    });

    return () => {
      socket.off("receiveMessage");
      socket.off("userTyping");
    };
  }, [userData]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleInputChange = (e) => {
    if (!userData) {
      toast.error("Please login to send messages", {
        position: "top-right",
        theme: "colored",
      });
      return;
    }
    setMessage(e.target.value);
    socket.emit("typing", { 
      groupId, 
      userName: userData.name,
      isTyping: e.target.value.length > 0
    });
  };

  const sendMessage = () => {
    if (!userData) {
      toast.error("Please login to send messages", {
        position: "top-right",
        theme: "colored",
      });
      return;
    }
    if (!message.trim()) return;

    // Debug log for userData
    console.log("userData in sendMessage:", userData);

    // Use id or _id for senderId
    const senderId = userData.id || userData._id;
    if (!senderId) {
      toast.error("User ID not found. Cannot send message.");
      return;
    }
  
    const newMessage = {
      senderId,
      senderName: userData.name,
      senderAvatar: userData.avatar,
      message,
      createdAt: new Date().toISOString(),
    };
  
    socket.emit("sendMessage", { groupId, ...newMessage });
    setMessage("");
    setShowEmojiPicker(false);
    socket.emit("typing", { 
      groupId, 
      userName: userData.name,
      isTyping: false
    });
    inputRef.current.focus();
  };

  const handleEmojiClick = (emojiObject) => {
    setMessage(prev => prev + emojiObject.emoji);
    inputRef.current.focus();
  };

  return (
    <div className="flex flex-col md:flex-row h-screen min-h-0 overflow-hidden bg-gray-50 pt-16">
      {/* Sidebar - Can be toggled in mobile view */}
      <div className="hidden md:block w-64 md:w-80 h-screen overflow-hidden bg-white border-r border-gray-200 p-6 rounded-tr-2xl rounded-br-2xl shadow-md">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-gray-800">Community Chat</h2>
          
        </div>
        <div className="mb-8">
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">
            Group Info
          </h3>
          <div className="bg-gray-50 p-4 rounded-xl shadow-sm">
            <h4 className="font-semibold text-gray-700">Travel Enthusiasts</h4>
            <p className="text-sm text-gray-600 mt-1">
              Connect with fellow travelers and share your experiences
            </p>
          </div>
        </div>
        <div>
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">
            Guidelines
          </h3>
          <ul className="space-y-2 text-sm text-gray-700">
            <li className="flex items-start">
              <span className="text-blue-400 mr-2">•</span>
              Be respectful to all members
            </li>
            <li className="flex items-start">
              <span className="text-blue-400 mr-2">•</span>
              No spam or self-promotion
            </li>
            <li className="flex items-start">
              <span className="text-blue-400 mr-2">•</span>
              Keep conversations relevant
            </li>
          </ul>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col h-screen min-h-0 overflow-hidden">
        {/* Chat Header */}
        <div className="bg-white border-b border-gray-200 px-5 flex items-center justify-between shadow-sm sticky top-0 z-20 rounded-tl-2xl h-16 min-h-[4rem] max-h-[4rem]">
          <div className="flex items-center">
            <button 
              onClick={() => navigate(-1)} 
              className="md:hidden mr-4 text-gray-500 hover:text-blue-600 focus:outline-none"
            >
              <FaArrowLeft className="text-lg" />
            </button>
            <div>
              <h1 className="text-xl font-bold text-gray-800">Travel Community</h1>
              <div className="flex items-center">
                {isTyping ? (
                  <p className="text-xs text-blue-500 italic animate-pulse">typing...</p>
                ) : (
                  <p className="text-xs text-gray-500 flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-1 animate-pulse"></div>
                    {onlineUsers} {onlineUsers === 1 ? 'person' : 'people'} online
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 min-h-0 overflow-y-auto p-6 space-y-3 bg-gray-50">
          {messages.map((msg, idx) => {
            const myId = userData?.id || userData?._id;
            const isOwn = msg.senderId === myId;
            return (
              <div 
                key={idx}
                className={`flex ${isOwn ? 'justify-end' : 'justify-start'} mb-2`}
              >
                <div
                  className={`max-w-xs px-5 py-3 rounded-2xl shadow-sm border transition-all duration-200
                    ${isOwn
                      ? 'bg-blue-50 border-blue-200 text-blue-900 rounded-br-none'
                      : 'bg-white border-gray-200 text-gray-800 rounded-bl-none'
                    }
                  `}
                  style={{ wordBreak: 'break-word' }}
                >
                  <div className="text-xs font-bold mb-1 tracking-wide text-gray-500">
                    {isOwn ? 'You' : msg.senderName}
                    </div>
                  <div className="text-base">{msg.message}</div>
                  <div className="text-[10px] text-right mt-1 opacity-60">
                    {msg.createdAt ? new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                  </div>
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        {/* Message Input */}
        <form
          onSubmit={e => {
            e.preventDefault();
            sendMessage();
          }}
          className="bg-white px-4 flex items-center gap-3 border-t border-gray-200 shadow-sm rounded-b-2xl h-16 min-h-[4rem] max-h-[4rem]"
        >
          <button
            type="button"
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            className="text-2xl text-gray-400 hover:text-blue-500 focus:outline-none transition-colors"
            tabIndex={-1}
          >
            <FaSmile />
          </button>
          {showEmojiPicker && (
            <div className="absolute bottom-20 left-4 z-50">
              <EmojiPicker onEmojiClick={handleEmojiClick} theme="light" />
            </div>
          )}
            <input
              ref={inputRef}
              type="text"
              value={message}
              onChange={handleInputChange}
            placeholder="Type your message..."
            className="flex-1 px-4 py-2 rounded-full border border-gray-200 focus:ring-2 focus:ring-blue-200 focus:outline-none bg-white text-gray-900 shadow-sm transition-all duration-200"
            autoComplete="off"
            />
            <button
            type="submit"
            className="ml-2 px-5 py-2 rounded-full bg-blue-500 text-white font-semibold shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-200 transition-all duration-200"
            >
            <IoMdSend className="inline-block text-lg align-middle" />
            </button>
        </form>
      </div>
    </div>
  );
}