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
    <div className="flex flex-col md:flex-row h-screen min-h-0 overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Modern Sidebar */}
      <div className="hidden md:block w-64 lg:w-80 h-screen overflow-hidden bg-gradient-to-b from-slate-800 to-slate-900 border-r border-white/10 p-4 lg:p-6 backdrop-blur-xl flex-shrink-0">
        {/* Back Button */}
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-300 hover:text-white mb-6 transition-all duration-300 group"
        >
          <FaArrowLeft className="group-hover:-translate-x-1 transition-transform duration-300" />
          <span className="font-medium">Back</span>
        </button>
        
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Community Chat</h2>
          <span className="bg-green-500/20 text-green-300 text-xs px-3 py-1.5 rounded-full border border-green-500/30 flex items-center backdrop-blur-md">
            <div className="relative flex items-center mr-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <div className="absolute w-2 h-2 bg-green-400 rounded-full animate-ping"></div>
            </div>
            {onlineUsers} online
          </span>
        </div>
        <div className="mb-8">
          <h3 className="text-sm font-semibold text-blue-300 uppercase tracking-wider mb-3 flex items-center gap-2">
            <span className="text-xl">ℹ️</span>
            Group Info
          </h3>
          <div className="bg-white/5 backdrop-blur-md p-5 rounded-2xl border border-white/10 shadow-lg">
            <h4 className="font-semibold text-white text-lg flex items-center gap-2">
              <span>✈️</span> Travel Enthusiasts
            </h4>
            <p className="text-sm text-gray-300 mt-2 leading-relaxed">
              Connect with fellow travelers and share your experiences
            </p>
          </div>
        </div>
        <div>
          <h3 className="text-sm font-semibold text-purple-300 uppercase tracking-wider mb-3 flex items-center gap-2">
            <span className="text-xl">📜</span>
            Guidelines
          </h3>
          <ul className="space-y-3 text-sm text-gray-300">
            <li className="flex items-start bg-white/5 p-3 rounded-xl border border-white/10">
              <span className="text-green-400 mr-2 text-lg">✓</span>
              Be respectful to all members
            </li>
            <li className="flex items-start bg-white/5 p-3 rounded-xl border border-white/10">
              <span className="text-green-400 mr-2 text-lg">✓</span>
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
      <div className="flex-1 flex flex-col h-screen min-h-0 overflow-hidden w-full">
        {/* Chat Header */}
        <div className="bg-white border-b border-gray-200 px-3 sm:px-5 flex items-center justify-between shadow-sm sticky top-0 z-20 md:rounded-tl-2xl h-14 sm:h-16 min-h-[3.5rem] sm:min-h-[4rem] max-h-[3.5rem] sm:max-h-[4rem]">
          <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
            <button 
              onClick={() => navigate(-1)} 
              className="text-gray-600 hover:text-blue-600 focus:outline-none transition-colors duration-300 hover:scale-110 active:scale-95 flex-shrink-0"
              aria-label="Go back"
            >
              <FaArrowLeft className="text-lg sm:text-xl" />
            </button>
            <div className="min-w-0 flex-1">
              <h1 className="text-base sm:text-xl font-bold text-gray-800 truncate">Travel Community</h1>
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
        <div className="flex-1 min-h-0 overflow-y-auto p-3 sm:p-4 md:p-6 space-y-2 sm:space-y-3 bg-gray-50">
          {messages.map((msg, idx) => {
            const myId = userData?.id || userData?._id;
            const isOwn = msg.senderId === myId;
            return (
              <div 
                key={idx}
                className={`flex ${isOwn ? 'justify-end' : 'justify-start'} mb-2`}
              >
                <div
                  className={`max-w-[85%] sm:max-w-md md:max-w-lg px-3 sm:px-4 md:px-5 py-2 sm:py-3 rounded-2xl shadow-sm border transition-all duration-200
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
                  <div className="text-sm sm:text-base">{msg.message}</div>
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
          className="bg-white px-2 sm:px-4 flex items-center gap-2 sm:gap-3 border-t border-gray-200 shadow-sm md:rounded-b-2xl h-14 sm:h-16 min-h-[3.5rem] sm:min-h-[4rem] max-h-[3.5rem] sm:max-h-[4rem]"
        >
          <button
            type="button"
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            className="text-xl sm:text-2xl text-gray-400 hover:text-blue-500 focus:outline-none transition-colors flex-shrink-0"
            tabIndex={-1}
          >
            <FaSmile />
          </button>
          {showEmojiPicker && (
            <div className="absolute bottom-16 sm:bottom-20 left-2 sm:left-4 z-50">
              <EmojiPicker onEmojiClick={handleEmojiClick} theme="light" />
            </div>
          )}
            <input
              ref={inputRef}
              type="text"
              value={message}
              onChange={handleInputChange}
            placeholder="Type message..."
            className="flex-1 px-3 sm:px-4 py-2 rounded-full border border-gray-200 focus:ring-2 focus:ring-blue-200 focus:outline-none bg-white text-gray-900 shadow-sm transition-all duration-200 text-sm sm:text-base min-w-0"
            autoComplete="off"
            />
            <button
            type="submit"
            className="px-3 sm:px-5 py-2 rounded-full bg-blue-500 text-white font-semibold shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-200 transition-all duration-200 flex-shrink-0"
            >
            <IoMdSend className="inline-block text-base sm:text-lg align-middle" />
            </button>
        </form>
      </div>
    </div>
  );
}