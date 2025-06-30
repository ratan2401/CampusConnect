import React, { useRef,useState,useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/authContext";

export default function Navigation() {
  const { user } = useAuth();
  const [search, setSearch] = useState("");
  const [showSearchPopup, setShowSearchPopup] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef(null);
  const avatarRef = useRef(null);

  const navigate = useNavigate();
  const location = useLocation();

  const handleSearch = async (e) => {
    setSearch(e.target.value);
    if (e.target.value.length > 1) {
      const res = await fetch(
        `http://localhost:3000/api/user/search?q=${e.target.value}`,
        {
          headers: { token: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      const data = await res.json();
      setSearchResults(data.users);
      setShowSearchPopup(true);
    } else {
      setShowSearchPopup(false);
    }
  };

  useEffect(() => {
    if (!showMenu) return;
    const handleClickOutside = (event) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target) &&
        avatarRef.current &&
        !avatarRef.current.contains(event.target)
      ) {
        setShowMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showMenu]);

  const activeClass = "bg-blue-600";
  const inactiveClass = "bg-blue-950 hover:bg-blue-600";

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-gray-900 text-white flex items-center px-6 py-3 justify-between">
      <div className="flex items-center gap-8">
        <div className="bg-gray-900 text-white px-4 py-2 text-2xl font-bold">
          CampusConnect
        </div>

        <div
          onClick={() => navigate("/home/" + user.username)}
          className={`px-4 py-2 rounded cursor-pointer ${
            location.pathname.startsWith("/home") ? activeClass : inactiveClass
          }`}
        >
          Home
        </div>

        <div
          onClick={() => navigate("/friends")}
          className={`px-4 py-2 rounded cursor-pointer ${
            location.pathname.startsWith("/friends")
              ? activeClass
              : inactiveClass
          }`}
        >
          Friends
        </div>

        <div
          onClick={() => navigate("/notifications")}
          className={`px-4 py-2 rounded cursor-pointer ${
            location.pathname.startsWith("/notifications")
              ? activeClass
              : inactiveClass
          }`}
        >
          Notifications
        </div>

        {/* Search Box */}
        <div className="relative">
          <input
            type="text"
            className="rounded px-2 py-1 text-white border border-white bg-gray-800 w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Search users..."
            value={search}
            onChange={handleSearch}
            onFocus={() => search && setShowSearchPopup(true)}
            onBlur={() => setTimeout(() => setShowSearchPopup(false), 200)}
          />
          {showSearchPopup && (
            <div className="absolute bg-white text-black mt-1 rounded shadow-lg w-64 z-20">
              {searchResults.length === 0 ? (
                <div className="p-2">No users found</div>
              ) : (
                searchResults.map((u) => (
                  <div
                    key={u._id}
                    className="p-2 hover:bg-gray-200 cursor-pointer flex items-center gap-2"
                    onClick={() => navigate(`/profile/${u.username}`)}
                  >
                    <img
                      src={u.profilePic || "/default.png"}
                      alt=""
                      className="w-8 h-8 rounded-full"
                    />
                    <span>
                      {u.name}{" "}
                      <span className="text-gray-500">@{u.username}</span>
                    </span>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>

      {/* Profile Avatar and Menu */}
      <div className="flex-col items-center gap-2 relative">
        <img
          ref={avatarRef}
          src={user.profilePic}
          alt="profile"
          className="w-10 h-10 rounded-full border-2 border-white cursor-pointer"
          onClick={() => setShowMenu((prev) => !prev)}
        />
        <span className="ml-2">{user.username}</span>

        {showMenu && (
          <div
            ref={menuRef}
            className="absolute right-0 top-12 bg-white text-black rounded shadow-lg z-30 w-30"
          >
            <div
              className="p-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => navigate(`/profile/${user.username}`)}
            >
              View Profile
            </div>
            <div
              className="p-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => {
                localStorage.removeItem("token");
                window.location.href = "/";
              }}
            >
              Logout
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
