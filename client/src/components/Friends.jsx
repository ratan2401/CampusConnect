import React, { useEffect, useState } from "react";
import axios from "axios";
import Navigation from "./Navigation";
import { useNavigate } from "react-router-dom";

export default function Friends() {
  const [friends, setFriends] = useState([]);
  const [suggested, setSuggested] = useState([]);
  const [activeTab, setActiveTab] = useState("friends");
  const [userCollege, setUserCollege] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("http://localhost:3000/api/user/profile", {
        headers: { token: `Bearer ${localStorage.getItem("token")}` },
      })
      .then((res) => {
        setUserCollege(res.data.user.college);
      });

    axios
      .get("http://localhost:3000/api/user/friends", {
        headers: { token: `Bearer ${localStorage.getItem("token")}` },
      })
      .then((res) => setFriends(res.data.friends));
  }, []);

  const fetchSuggested = async () => {
    if (!userCollege) return;
    const res = await axios.get(
      `http://localhost:3000/api/user/suggested?college=${encodeURIComponent(
        userCollege
      )}`,
      { headers: { token: `Bearer ${localStorage.getItem("token")}` } }
    );
    setSuggested(res.data.users);
  };

  useEffect(() => {
    if (activeTab === "suggested" && userCollege) {
      fetchSuggested();
    }
  }, [activeTab, userCollege]);

  const handleSendFriendRequest = async (userId) => {
    try {
      await axios.post(
        "http://localhost:3000/api/user/sendFriendRequest",
        { userId },
        { headers: { token: `Bearer ${localStorage.getItem("token")}` } }
      );
      fetchSuggested();
    } catch (err) {
      alert("Failed to send friend request.");
    }
  };

  const handleAcceptFriendRequest = async (userId) => {
    try {
      await axios.post(
        "http://localhost:3000/api/user/acceptFriendRequest",
        { userId },
        { headers: { token: `Bearer ${localStorage.getItem("token")}` } }
      );
      fetchSuggested();
    } catch (err) {
      alert("Failed to accept friend request.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-700 pt-20">
      <Navigation />
      <div className="max-w-5xl mx-auto mt-8 bg-gray-900 rounded shadow p-6">
        <div className="flex gap-4 mb-6">
          <div
            className={`px-4 py-2 rounded font-semibold ${
              activeTab === "friends"
                ? "bg-blue-600 text-white cursor-pointer"
                : "bg-blue-950 text-gray-400 cursor-pointer"
            }`}
            onClick={() => setActiveTab("friends")}
          >
            Current Friends
          </div>
          <div
            className={`px-4 py-2 rounded font-semibold ${
              activeTab === "suggested"
                ? "bg-blue-600 text-white cursor-pointer"
                : "bg-blue-950 text-gray-400 cursor-pointer"
            }`}
            onClick={() => setActiveTab("suggested")}
          >
            Suggested Friends
          </div>
        </div>

        {activeTab === "friends" && (
          <>
            <h2 className="text-xl font-bold mb-4 text-white">Your Friends</h2>
            {friends.length === 0 && (
              <div className="text-gray-300">No friends yet.</div>
            )}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {friends.map((f) => (
                <div
                  key={f._id}
                  className="flex flex-col items-center bg-gray-800 rounded-lg p-4 cursor-pointer hover:bg-gray-700 transition"
                  onClick={() => navigate(`/profile/${f.username}`)}
                >
                  <img
                    src={f.profilePic}
                    alt=""
                    className="w-16 h-16 rounded-full mb-2"
                  />
                  <span className="text-white text-center">
                    {f.name} <br />{" "}
                    <span className="text-gray-400 text-sm">@{f.username}</span>
                  </span>
                </div>
              ))}
            </div>
          </>
        )}
        {activeTab === "suggested" && (
          <>
            <h2 className="text-xl font-bold mb-4 text-white">
              Suggested Friends
            </h2>
            {suggested.length === 0 && (
              <div className="text-gray-300">No suggested users found.</div>
            )}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {suggested.map((u) => (
                <div
                  key={u._id}
                  className="flex flex-col items-center bg-gray-800 rounded-lg p-4 cursor-pointer hover:bg-gray-700 transition"
                  onClick={() => navigate(`/profile/${u.username}`)}
                >
                  <img
                    src={u.profilePic}
                    alt=""
                    className="w-16 h-16 rounded-full mb-2"
                  />
                  <span className="text-white text-center">
                    {u.name} <br />{" "}
                    <span className="text-gray-400 text-sm">@{u.username}</span>
                  </span>
                  {u.requestReceived ? (
                    <button
                      className="mt-2 px-2 py-1 bg-green-600 text-white rounded cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAcceptFriendRequest(u._id);
                      }}
                    >
                      Accept Friend Request
                    </button>
                  ) : !u.requestSent ? (
                    <button
                      className="mt-2 px-2 py-1 bg-blue-500 text-white rounded cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSendFriendRequest(u._id);
                      }}
                    >
                      Send Friend Request
                    </button>
                  ) : (
                    <span className="mt-2 text-yellow-400">Request Sent</span>
                  )}
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
