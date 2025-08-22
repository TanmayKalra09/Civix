import { useState, useRef, useEffect } from 'react';
import { Send, Users, MessageCircle, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function CivixChatRoom() {
  const [messages, setMessages] = useState([
    // your existing messages ...
  ]);
  
  const [newMessage, setNewMessage] = useState('');
  const [onlineUsers] = useState(127);
  const messagesEndRef = useRef(null);
  const navigate = useNavigate();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim()) {
      const message = {
        id: messages.length + 1,
        user: 'You',
        avatar: 'YU',
        message: newMessage,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isCurrentUser: true
      };
      setMessages([...messages, message]);
      setNewMessage('');
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-green-50 to-emerald-50 dark:from-gray-900 dark:to-slate-900">
      {/* Header with Back Button */}
      <div className="bg-white border-b border-green-100 shadow-sm dark:bg-gray-800 dark:border-gray-700">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center space-x-3">
            {/* Back Button */}
            <button
              onClick={() => navigate(-1)}
              className="p-2 rounded-full bg-green-100 hover:bg-green-200 dark:bg-green-900 dark:hover:bg-green-800"
            >
              <ArrowLeft className="w-5 h-5 text-green-600 dark:text-green-400" />
            </button>

            <div className="bg-green-100 p-2 rounded-lg dark:bg-green-900">
              <MessageCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-800 dark:text-white">Civix Community Chat</h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">Community Services & Local Initiatives</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2 bg-green-50 px-3 py-1 rounded-full dark:bg-green-900/50">
            <Users className="w-4 h-4 text-green-600 dark:text-green-400" />
            <span className="text-sm font-medium text-green-700 dark:text-green-300">{onlineUsers} online</span>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-start space-x-3 ${msg.isCurrentUser ? 'flex-row-reverse space-x-reverse' : ''}`}
          >
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-medium ${
                msg.isCurrentUser ? 'bg-green-600' : 'bg-gradient-to-br from-green-400 to-emerald-500'
              }`}
            >
              {msg.avatar}
            </div>

            <div className={`flex-1 max-w-xs sm:max-w-md ${msg.isCurrentUser ? 'text-right' : ''}`}>
              <div
                className={`rounded-lg p-3 shadow-sm ${
                  msg.isCurrentUser
                    ? 'bg-green-600 text-white dark:bg-green-700'
                    : 'bg-white border border-green-100 dark:bg-gray-800 dark:border-gray-700'
                }`}
              >
                {!msg.isCurrentUser && (
                  <p className="text-sm font-medium text-green-700 mb-1 dark:text-green-400">{msg.user}</p>
                )}
                <p
                  className={`text-sm leading-relaxed ${
                    msg.isCurrentUser ? 'text-white' : 'text-gray-800 dark:text-gray-200'
                  }`}
                >
                  {msg.message}
                </p>
              </div>
              <p
                className={`text-xs text-gray-400 mt-1 ${
                  msg.isCurrentUser ? 'text-right' : 'text-left'
                } dark:text-gray-500`}
              >
                {msg.timestamp}
              </p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Box */}
      <div className="bg-white border-t border-green-100 p-4 dark:bg-gray-800 dark:border-gray-700">
        <div className="flex items-center space-x-3">
          <div className="flex-1 relative">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSendMessage(e);
              }}
              placeholder="Share your community initiative or ask for help..."
              className="w-full p-3 pr-4 border border-green-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent placeholder-gray-400 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-500 dark:focus:ring-green-400"
            />
          </div>
          <button
            onClick={handleSendMessage}
            disabled={!newMessage.trim()}
            className="bg-green-600 hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white p-3 rounded-lg transition-colors duration-200 shadow-sm dark:bg-green-700 dark:hover:bg-green-800 dark:disabled:bg-gray-600"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-2 text-center dark:text-gray-400">
          Connect with your community • Share resources • Make a difference together
        </p>
      </div>
    </div>
  );
}
