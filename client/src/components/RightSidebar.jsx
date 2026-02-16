import React, { useContext, useMemo, useEffect, useState } from "react";
import assets from "../assets/assets";
import { ChatContext } from "../../context/ChatContext.jsx";
import { AuthContext } from "../../context/AuthContext.jsx";

const RightSidebar = () => {
  const { selectedUser, messages } = useContext(ChatContext);
  const { onlineUser, logout, authUser } = useContext(AuthContext);



  const [previewUrl, setPreviewUrl] = useState(null);

  // ✅ Always compute safely
  const mediaImages = useMemo(() => {
    if (!Array.isArray(messages)) return [];
    return messages
      .filter((msg) => typeof msg?.image === "string" && msg.image.trim() !== "")
      .map((msg) => msg.image);
  }, [messages]);

  const isOnline = selectedUser?._id
    ? onlineUser?.includes(selectedUser._id)
    : false;

  // Close on ESC
  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === "Escape") setPreviewUrl(null);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);




  if (!selectedUser || selectedUser._id === authUser?._id) {
    return;
  }


  return (
    <div className="bg-[#8185B2]/10 text-white w-full relative overflow-y-auto max-md:hidden">
      {/* Profile Section */}
      <div className="pt-16 flex flex-col items-center gap-2 text-xs font-light mx-auto">
        <img
          src={selectedUser?.profilePic || assets.avatar_icon}
          alt="ProfilePic"
          className="w-20 aspect-square rounded-full object-cover"
        />

        <h1 className="px-10 text-xl font-medium mx-auto flex items-center gap-2">
          <span
            className={`w-2 h-2 rounded-full ${isOnline ? "bg-green-500" : "bg-gray-400"
              }`}
          />
          {selectedUser?.fullName || "User"}
        </h1>

        {selectedUser?.bio && (
          <p className="px-10 mx-auto text-center text-white/70">
            {selectedUser.bio}
          </p>
        )}
      </div>

      <hr className="mt-5 border-[#ffffff33] mb-5" />

      {/* Media Section */}
      <div className="px-5 text-xs pb-24">
        <p className="font-medium mb-2">Media</p>

        <div className="max-h-[200px] overflow-y-auto grid grid-cols-3 gap-2 opacity-90">
          {mediaImages.length > 0 ? (
            mediaImages.map((url, index) => (
              <button
                key={`${url}-${index}`}
                type="button"
                onClick={() => setPreviewUrl(url)}
                className="cursor-pointer rounded overflow-hidden hover:scale-105 transition"
              >
                <img
                  src={url}
                  alt="media"
                  className="w-full aspect-square object-cover"
                  loading="lazy"
                />
              </button>
            ))
          ) : (
            <p className="text-white/50 col-span-3 text-center">
              No media shared yet
            </p>
          )}
        </div>
      </div>

      {/* Logout Button */}
      <button
        onClick={() => {
          logout();
        }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-gradient-to-r from-[#077eff] to-[#a156ff] text-white text-sm font-medium py-2.5 px-12 rounded-full shadow-lg hover:brightness-110 hover:scale-105 transition-all duration-300 active:scale-95"
      >
        Logout
      </button>

      {/* ✅ Image Preview Modal (WHITE overlay + white card) */}
      {previewUrl && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm p-4"
          onClick={() => setPreviewUrl(null)}
        >
          <div
            className="relative max-w-[90vw] max-h-[85vh] rounded-2xl overflow-hidden bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setPreviewUrl(null)}
              className="absolute top-3 right-3 bg-black/10 hover:bg-black/20 text-black rounded-full w-8 h-8 flex items-center justify-center text-lg"
            >
              ✕
            </button>

            <img
              src={previewUrl}
              alt="preview"
              className="max-w-[90vw] max-h-[85vh] object-contain"
            />
          </div>
        </div>
      )}
    </div>
  );
};


export default RightSidebar;