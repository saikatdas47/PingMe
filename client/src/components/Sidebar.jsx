import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext.jsx";
import { ChatContext } from "../../context/ChatContext.jsx";
import assets from "../assets/assets";

const Sidebar = () => {
  const {
    getUsers,
    users,
    selectedUser,
    setSelectedUser,
    unseenMessages,
    setUnseenMessages,
  } = useContext(ChatContext);

  const { logout, onlineUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const [openMenu, setOpenMenu] = useState(false);
  const [input, setInput] = useState("");

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = () => setOpenMenu(false);

    if (openMenu) window.addEventListener("click", handleClickOutside);

    return () => window.removeEventListener("click", handleClickOutside);
  }, [openMenu]);

  // Fetch users when online users change
  useEffect(() => {
    getUsers();
  }, [onlineUser, getUsers]);

  const filteredUsers = input
    ? users.filter((user) =>
      user.fullName?.toLowerCase().includes(input.toLowerCase())
    )
    : users;

  return (
    <div
      className={`bg-[#8185B2]/10 h-full p-5 rounded-r-xl overflow-y-scroll text-white ${selectedUser ? "max-md:hidden" : ""
        }`}
    >
      {/* Header */}
      <div className="pb-5">
        <div className="flex justify-between items-center">
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => {
              setSelectedUser(null);   // optional but good (go home clean)
              navigate("/");
            }}
          >
            <img src={assets.logo} alt="logo" className="max-w-10" />
            <p className="font-bold">PingMe</p>
          </div>

          <div className="relative py-2">
            <img
              src={assets.menu_icon}
              alt="menu"
              className="max-h-5 cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                setOpenMenu((prev) => !prev);
              }}
            />

            <div
              className={`absolute top-full right-0 z-20 w-32 p-4 rounded-md bg-[#282142] border border-gray-600 text-gray-100 ${openMenu ? "block" : "hidden"
                }`}
              onClick={(e) => e.stopPropagation()}
            >
              <p
                onClick={() => {
                  setOpenMenu(false);
                  navigate("/profile");
                }}
                className="cursor-pointer text-sm"
              >
                Edit Profile
              </p>

              <hr className="my-2 border-t border-gray-500" />

              <p
                onClick={() => {
                  setOpenMenu(false);
                  logout();
                  navigate("/login");
                }}
                className="cursor-pointer text-sm"
              >
                Logout
              </p>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="bg-[#282142] rounded-full flex items-center gap-2 px-4 py-3 mt-5">
          <img src={assets.search_icon} alt="search" className="w-4" />
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            type="text"
            className="bg-transparent border-none outline-none text-white text-xs placeholder-[#c8c8c8] flex-1"
            placeholder="Search User..."
          />
        </div>
      </div>

      {/* User List */}
      <div className="flex flex-col">
        {filteredUsers.map((user) => (
          <div
            key={user._id}
            onClick={() => {
              if (selectedUser?._id === user._id) return;

              setSelectedUser(user);

              // ✅ reset unseen count for this user
              setUnseenMessages((prev) => ({
                ...prev,
                [user._id]: 0,
              }));
            }}
            className={`relative flex items-center gap-3 p-2 pl-4 rounded cursor-pointer max-sm:text-sm ${selectedUser?._id === user._id ? "bg-[#282142]/50" : ""
              }`}
          >
            <img
              src={user?.profilePic || assets.avatar_icon}
              alt="avatar"
              className="w-[35px] aspect-square rounded-full object-cover"
            />

            <div className="flex flex-col leading-5">
              <p>{user.fullName}</p>
              <span
                className={`text-xs ${onlineUser?.includes(user._id)
                    ? "text-green-400"
                    : "text-neutral-400"
                  }`}
              >
                {onlineUser?.includes(user._id) ? "Online" : "Offline"}
              </span>
            </div>

            {unseenMessages?.[user._id] > 0 && (
              <p className="absolute top-3 right-3 text-xs h-5 w-5 flex justify-center items-center rounded-full bg-violet-500/60">
                {unseenMessages[user._id]}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;