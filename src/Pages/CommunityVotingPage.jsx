import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  TrendingUp,
  Newspaper,
  Heart,
  MessageCircle,
  PlusCircle,
} from "lucide-react";

const CommunityPage = () => {
  const [selectedTab, setSelectedTab] = useState("voting"); // voting | feed
  const [selectedArea, setSelectedArea] = useState("All Areas");
  const [sortBy, setSortBy] = useState("Most Votes");
  const [votedIssues, setVotedIssues] = useState({});
  const [posts, setPosts] = useState([
    {
      id: 1,
      title: "Main Street Pothole Fixed!",
      content:
        "The pothole reported last week has been repaired by the municipal team. Thank you for voting!",
      likes: 12,
      comments: ["Great news!", "Finally fixed 👏"],
    },
    {
      id: 2,
      title: "Waste Collection Improved",
      content:
        "Garbage collection in South Delhi is now consistent after community votes highlighted the issue.",
      likes: 8,
      comments: [],
    },
  ]);
  const [likedPosts, setLikedPosts] = useState({});
  const [newPost, setNewPost] = useState({ title: "", content: "" });
  const [isModalOpen, setIsModalOpen] = useState(false);

  // ---- Voting Data ----
  const [issues, setIssues] = useState([
    {
      id: 1,
      title: "Pothole on Main Street",
      area: "Noida",
      daysOpen: 3,
      votes: 15,
      accidentsReported: 2,
      status: "Open",
      priority: "high",
    },
    {
      id: 2,
      title: "Broken Street Light",
      area: "East Delhi",
      daysOpen: 5,
      votes: 8,
      accidentsReported: 1,
      status: "Open",
      priority: "medium",
    },
    {
      id: 3,
      title: "Garbage Not Collected",
      area: "South Delhi",
      daysOpen: 7,
      votes: 22,
      accidentsReported: 0,
      status: "Open",
      priority: "low",
    },
    {
      id: 4,
      title: "Water Leakage Issue",
      area: "West Delhi",
      daysOpen: 2,
      votes: 32,
      accidentsReported: 0,
      status: "In Progress",
      priority: "high",
    },
  ]);

  const areas = [
    "All Areas",
    "Noida",
    "East Delhi",
    "West Delhi",
    "North Delhi",
    "South Delhi",
    "Ghaziabad",
  ];
  const sortOptions = [
    "Most Votes",
    "Most Recent",
    "Longest Open",
    "Most Accidents",
  ];

  // ---- Voting Logic ----
  const filteredIssues = issues
    .filter(
      (issue) => selectedArea === "All Areas" || issue.area === selectedArea
    )
    .sort((a, b) => {
      if (sortBy === "Most Votes") return b.votes - a.votes;
      if (sortBy === "Most Recent") return b.daysOpen - a.daysOpen;
      if (sortBy === "Longest Open") return a.daysOpen - b.daysOpen;
      if (sortBy === "Most Accidents")
        return b.accidentsReported - a.accidentsReported;
      return 0;
    });

  const handleVote = (id) => {
    const hasVoted = votedIssues[id];
    setIssues(
      issues.map((issue) =>
        issue.id === id
          ? { ...issue, votes: hasVoted ? issue.votes - 1 : issue.votes + 1 }
          : issue
      )
    );
    setVotedIssues((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-700";
      case "medium":
        return "bg-yellow-100 text-yellow-700";
      case "low":
        return "bg-green-100 text-green-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };
  const getStatusColor = (status) => {
    switch (status) {
      case "Open":
        return "bg-blue-100 text-blue-700";
      case "In Progress":
        return "bg-orange-100 text-orange-700";
      case "Resolved":
        return "bg-green-100 text-green-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  // ---- Feed Logic ----
  const handleLike = (id) => {
    setPosts(
      posts.map((p) =>
        p.id === id
          ? { ...p, likes: likedPosts[id] ? p.likes - 1 : p.likes + 1 }
          : p
      )
    );
    setLikedPosts((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleAddComment = (id, comment) => {
    if (!comment.trim()) return;
    setPosts(
      posts.map((p) =>
        p.id === id ? { ...p, comments: [...p.comments, comment] } : p
      )
    );
  };

  const handleCreatePost = () => {
    if (!newPost.title.trim() || !newPost.content.trim()) return;
    setPosts([
      {
        id: Date.now(),
        title: newPost.title,
        content: newPost.content,
        likes: 0,
        comments: [],
      },
      ...posts,
    ]);
    setNewPost({ title: "", content: "" });
    setIsModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50">
      {/* Tab Switch */}
      <div className="max-w-7xl mx-auto px-4 py-6 flex gap-4">
        <button
          onClick={() => setSelectedTab("voting")}
          className={`px-4 py-2 rounded-lg font-medium flex items-center gap-2 ${
            selectedTab === "voting"
              ? "bg-green-600 text-white"
              : "bg-gray-200 text-gray-700"
          }`}
        >
          <TrendingUp className="w-4 h-4" /> Voting
        </button>
        <button
          onClick={() => setSelectedTab("feed")}
          className={`px-4 py-2 rounded-lg font-medium flex items-center gap-2 ${
            selectedTab === "feed"
              ? "bg-green-600 text-white"
              : "bg-gray-200 text-gray-700"
          }`}
        >
          <Newspaper className="w-4 h-4" /> Feed
        </button>
      </div>

      {/* Voting Section */}
      {selectedTab === "voting" && (
        <div className="max-w-7xl mx-auto px-4">
          {/* Filters */}
          <div className="bg-white/70 p-6 rounded-2xl shadow-sm mb-6">
            <div className="grid sm:grid-cols-2 gap-6">
              <div>
                <label className="text-sm font-medium">Area</label>
                <select
                  value={selectedArea}
                  onChange={(e) => setSelectedArea(e.target.value)}
                  className="w-full p-2 rounded-xl border"
                >
                  {areas.map((area) => (
                    <option key={area}>{area}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium">Sort By</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full p-2 rounded-xl border"
                >
                  {sortOptions.map((opt) => (
                    <option key={opt}>{opt}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Issues */}
          <div className="grid gap-6">
            {filteredIssues.map((issue) => (
              <div
                key={issue.id}
                className="bg-white/70 p-6 rounded-2xl shadow-sm"
              >
                <h3 className="text-xl font-bold">{issue.title}</h3>
                <p className="text-sm text-gray-600">{issue.area}</p>
                <span
                  className={`px-3 py-1 text-xs rounded-full ${getPriorityColor(
                    issue.priority
                  )}`}
                >
                  {issue.priority} priority
                </span>
                <span
                  className={`ml-2 px-3 py-1 text-xs rounded-full ${getStatusColor(
                    issue.status
                  )}`}
                >
                  {issue.status}
                </span>
                <div className="mt-4 flex justify-between items-center">
                  <button
                    onClick={() => handleVote(issue.id)}
                    className={`px-4 py-2 rounded-lg text-white ${
                      votedIssues[issue.id] ? "bg-gray-500" : "bg-green-600"
                    }`}
                  >
                    {votedIssues[issue.id] ? "Voted" : "Vote"} ({issue.votes})
                  </button>
                  <p className="text-sm text-gray-600">
                    {issue.daysOpen} days open
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Feed Section */}
      {selectedTab === "feed" && (
        <div className="max-w-4xl mx-auto px-4">
          {/* Create Post Button */}
          <div className="flex justify-end mb-6">
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg shadow"
            >
              <PlusCircle className="w-5 h-5" /> Create Post
            </button>
          </div>

          {/* Modal */}
          <AnimatePresence>
            {isModalOpen && (
              <motion.div
                className="fixed inset-0 flex items-center justify-center bg-black/50 z-50"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <motion.div
                  className="bg-white p-6 rounded-2xl shadow-lg w-full max-w-md"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                >
                  <h3 className="text-lg font-semibold mb-4">Create Post</h3>
                  <input
                    type="text"
                    placeholder="Post title"
                    value={newPost.title}
                    onChange={(e) =>
                      setNewPost((prev) => ({ ...prev, title: e.target.value }))
                    }
                    className="w-full border rounded-lg px-3 py-2 mb-3"
                  />
                  <textarea
                    placeholder="Write something..."
                    value={newPost.content}
                    onChange={(e) =>
                      setNewPost((prev) => ({
                        ...prev,
                        content: e.target.value,
                      }))
                    }
                    className="w-full border rounded-lg px-3 py-2 mb-3"
                  />
                  <div className="flex justify-end gap-3">
                    <button
                      onClick={() => setIsModalOpen(false)}
                      className="px-4 py-2 bg-gray-300 rounded-lg"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleCreatePost}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg"
                    >
                      Post
                    </button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Posts */}
          {posts.map((post) => (
            <div
              key={post.id}
              className="bg-white/70 p-6 rounded-2xl shadow-sm mb-6"
            >
              <h3 className="text-lg font-bold">{post.title}</h3>
              <p className="mt-2 text-gray-700">{post.content}</p>

              {/* Like & Comment */}
              <div className="flex items-center gap-4 mt-4">
                <button
                  onClick={() => handleLike(post.id)}
                  className="flex items-center gap-1 text-sm text-pink-600"
                >
                  <Heart
                    className={`w-4 h-4 ${
                      likedPosts[post.id] ? "fill-pink-600" : ""
                    }`}
                  />{" "}
                  {post.likes}
                </button>
                <span className="flex items-center gap-1 text-sm text-blue-600">
                  <MessageCircle className="w-4 h-4" /> {post.comments.length}
                </span>
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
                {post.comments.length > 0 && (
                  <ul className="mt-2 space-y-1">
                    {post.comments.map((c, i) => (
                      <li
                        key={i}
                        className="text-sm text-gray-700 bg-gray-100 px-3 py-1 rounded-lg"
                      >
                        {c}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CommunityPage;
