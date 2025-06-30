import React, { useEffect, useState } from "react";
import axios from "axios";
import Navigation from "./Navigation";
import { useNavigate } from "react-router-dom";

export default function Notification() {
  const [notifications, setNotifications] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("http://localhost:3000/api/notification", {
        headers: { token: `Bearer ${localStorage.getItem("token")}` },
      })
      .then((res) => setNotifications(res.data))
      .catch(() => setNotifications([]));
  }, []);

  // Helper to render notification message
  const renderMessage = (n) => {
    if (n.type === "like") {
      return (
        <>
          <span className="font-semibold text-blue-400">
            {n.fromUser?.username}
          </span>{" "}
          liked your post
        </>
      );
    }
    if (n.type === "comment") {
      return (
        <>
          <span className="font-semibold text-blue-400 ">
            {n.fromUser?.username}
          </span>{" "}
          commented on your post
        </>
      );
    }

    if (n.type === "friend_request") {
      return (
        <>
          <span className="font-semibold text-blue-400">
            {n.fromUser?.username}
          </span>{" "}
          sent you a friend request
        </>
      );
    }
    if (n.type === "friend_accept") {
      return (
        <>
          <span className="font-semibold text-blue-400">
            {n.fromUser?.username}
          </span>{" "}
          accepted your friend request
        </>
      );
    }
    if (n.type === "suggested_friend") {
      return (
        <>
          You may know{" "}
          <span className="font-semibold text-blue-400">
            {n.suggestedUser?.username} ({n.suggestedUser?.name})
          </span>
        </>
      );
    }
    return n.message;
  };

  return (
    <div className="min-h-screen bg-gray-700 pt-20">
      <Navigation />
      <div className="max-w-5xl mx-auto mt-8 bg-gray-900 rounded shadow p-6">
        <h2 className="text-xl font-bold mb-4">Notifications</h2>
        {notifications.length === 0 && <div>No notifications</div>}
        {notifications.map((n) => (
          <div
            key={n._id}
            className="border-b py-2 flex justify-between items-center"
          >
            <div className="flex items-center gap-3 w-full">
              {n.type === "suggested_friend" ? (
                <>
                  <span>You may know</span>
                  <div
                    className="flex items-center gap-1 cursor-pointer "
                    onClick={() =>
                      navigate(`/profile/${n.suggestedUser?.username}`)
                    }
                  >
                    {n.suggestedUser?.profilePic && (
                      <img
                        className="w-8 h-8 rounded-full border-2 border-white object-cover"
                        style={{ minWidth: 32, minHeight: 32 }}
                        src={n.suggestedUser.profilePic}
                        alt="profile"
                      />
                    )}
                    <span className="font-semibold text-blue-400">
                      {n.suggestedUser?.username} 
                    </span>
                  </div>
                </>
              ) : (
                <>
                  {/* For all other notifications, profile pic left, then message */}

                  <div
                    className="flex items-center gap-1 cursor-pointer"
                    onClick={() => navigate(`/profile/${n.fromUser?.username}`)}
                  >
                    {n.fromUser?.profilePic && (
                      <img
                        src={n.fromUser.profilePic}
                        alt="profile"
                        className="w-8 h-8 rounded-full border-2 border-white object-cover"
                        style={{ minWidth: 32, minHeight: 32 }}
                      />
                    )}
                    <div>{renderMessage(n)}</div>
                  </div>
                </>
              )}
            </div>
            {n.createdAt && (
              <div className="text-xs text-gray-400 ml-4">
                {new Date(n.createdAt).toLocaleDateString()}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
