import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  TrendingUp, Newspaper, MessageCircle, Heart, X
} from "lucide-react";

const CommunityVotingPage = () => {
  const [selectedTab, setSelectedTab] = useState("voting");
  const [votedIssues, setVotedIssues] = useState({});
  const [likedPosts, setLikedPosts] = useState({});
  const [comments, setComments] = useState({});

  // --- Issues (keep static) ---
  const [issues, setIssues] = useState([
    { id: 1, title: "Pothole on Main Street", area: "Noida", daysOpen: 3, votes: 15, accidentsReported: 2, status: "Open", priority: "high" },
    { id: 2, title: "Broken Street Light", area: "East Delhi", daysOpen: 5, votes: 8, accidentsReported: 1, status: "Open", priority: "medium" },
    { id: 3, title: "Garbage Not Collected", area: "South Delhi", daysOpen: 7, votes: 22, accidentsReported: 0, status: "Open", priority: "low" },
    { id: 4, title: "Water Leakage Issue", area: "West Delhi", daysOpen: 2, votes: 32, accidentsReported: 0, status: "In Progress", priority: "high" }
  ]);

  // --- Feed Posts (dynamic) ---
  const [posts, setPosts] = useState([
    { id: 1, title: "Main Street Pothole Fixed!", content: "The pothole reported last week has been successfully repaired by the municipal team. Thank you for voting!", likes: 10 },
    { id: 2, title: "Street Light Update", content: "Engineers have been dispatched to repair the broken street light in East Delhi. Expected resolution within 2 days.", likes: 6 },
  ]);

  // --- Create Feed Modal ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");

  // --- Voting Logic (unchanged) ---
  const handleVote = (id) => {
    const hasVoted = votedIssues[id];
    setIssues(issues.map(issue =>
      issue.id === id ? { ...issue, votes: hasVoted ? issue.votes - 1 : issue.votes + 1 } : issue
    ));
    setVotedIssues(prev => ({ ...prev, [id]: !prev[id] }));
  };

  // --- Feed Logic ---
  const handleLike = (postId) => {
    setPosts(posts.map(post =>
      post.id === postId ? { ...post, likes: likedPosts[postId] ? post.likes - 1 : post.likes + 1 } : post
    ));
    setLikedPosts(prev => ({ ...prev, [postId]: !prev[postId] }));
  };

  const handleAddComment = (postId, text) => {
    if (!text.trim()) return;
    setComments(prev => ({
      ...prev,
      [postId]: [...(prev[postId] || []), text]
    }));
  };

  const handleCreateFeed = (e) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;

    const newPost = {
      id: posts.length + 1,
      title: newTitle,
      content: newContent,
      likes: 0,
    };

    setPosts([newPost, ...posts]);
    setNewTitle("");
    setNewContent("");
    setIsModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 dark:from-gray-900 dark:via-gray-800 dark:to-green-900/20 transition-colors duration-300">
      {/* --- Tab Navigation --- */}
      <div className="max-w-7xl mx-auto px-4 py-6 flex space-x-4">
        <button 
          onClick={() => setSelectedTab("voting")}
          className={`px-4 py-2 rounded-lg font-medium flex items-center gap-2 ${selectedTab==="voting" ? "bg-green-600 text-white" : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300"}`}
        >
          <TrendingUp className="w-4 h-4"/> Voting
        </button>
        <button 
          onClick={() => setSelectedTab("feed")}
          className={`px-4 py-2 rounded-lg font-medium flex items-center gap-2 ${selectedTab==="feed" ? "bg-green-600 text-white" : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300"}`}
        >
          <Newspaper className="w-4 h-4"/> Feed
        </button>
      </div>

      {/* --- Voting Section (Static) --- */}
      {selectedTab === "voting" && (
        <motion.div className="max-w-7xl mx-auto px-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <div className="grid gap-6">
            {issues.map(issue => (
              <div key={issue.id} className="bg-white/70 dark:bg-gray-800/70 p-6 rounded-2xl shadow-sm">
                <h3 className="text-xl font-bold">{issue.title}</h3>
                <p className="text-sm text-gray-600">{issue.area}</p>
                <div className="mt-4 flex justify-between items-center">
                  <button onClick={() => handleVote(issue.id)} className={`px-4 py-2 rounded-lg text-white ${votedIssues[issue.id] ? "bg-gray-500" : "bg-green-600"}`}>
                    {votedIssues[issue.id] ? "Voted" : "Vote"} ({issue.votes})
                  </button>
                  <p className="text-sm text-gray-600">{issue.daysOpen} days open</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* --- Feed Section (Dynamic) --- */}
      {selectedTab === "feed" && (
        <motion.div className="max-w-7xl mx-auto px-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          {/* Create Feed Button */}
          <div className="flex justify-end mb-6">
            <button 
              onClick={() => setIsModalOpen(true)}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
            >
              + Create Feed
            </button>
          </div>

          {/* Feeds */}
          {posts.map(post => (
            <div key={post.id} className="bg-white/70 dark:bg-gray-800/70 p-6 rounded-2xl shadow-sm mb-6">
              <h3 className="text-lg font-bold">{post.title}</h3>
              <p className="mt-2 text-gray-700 dark:text-gray-300">{post.content}</p>
              
              {/* Like & Comment */}
              <div className="flex items-center gap-4 mt-4">
                <button onClick={() => handleLike(post.id)} className="flex items-center gap-1 text-sm text-pink-600">
                  <Heart className={`w-4 h-4 ${likedPosts[post.id] ? "fill-pink-600" : ""}`}/> {post.likes}
                </button>
                <button className="flex items-center gap-1 text-sm text-blue-600">
                  <MessageCircle className="w-4 h-4"/> {comments[post.id]?.length || 0}
                </button>
              </div>

              {/* Comment box */}
              <div className="mt-3">
                <input 
                  type="text"
                  placeholder="Add a comment..."
                  className="w-full border rounded-lg px-3 py-2"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleAddComment(post.id, e.target.value);
                      e.target.value = "";
                    }
                  }}
                />
                {comments[post.id]?.length > 0 && (
                  <ul className="mt-2 space-y-1">
                    {comments[post.id].map((c, i) => (
                      <li key={i} className="text-sm text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-lg">{c}</li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          ))}
        </motion.div>
      )}

      {/* --- Modal for Create Feed --- */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div 
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div 
              className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg w-full max-w-md"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold">Create New Feed</h2>
                <button onClick={() => setIsModalOpen(false)}>
                  <X className="w-5 h-5"/>
                </button>
              </div>
              <form onSubmit={handleCreateFeed}>
                <input 
                  type="text"
                  placeholder="Title"
                  className="w-full border p-2 rounded mb-3"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                />
                <textarea 
                  placeholder="Content"
                  className="w-full border p-2 rounded mb-3"
                  rows="4"
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                />
                <button 
                  type="submit"
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg w-full"
                >
                  Post
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CommunityVotingPage;
