import React, { useContext, useEffect, useRef, useState } from "react";
import assets from "../assets/assets";
import { formatMsgTime } from "../lib/utlis";
import { ChatContext } from "../../context/ChatContext.jsx";
import { AuthContext } from "../../context/AuthContext.jsx";
import toast from "react-hot-toast";

const ChatContainer = () => {
    const { messages, selectedUser, setSelectedUser, getMessages, sendMessage } =
        useContext(ChatContext);

    const { authUser, onlineUser } = useContext(AuthContext);

    const scrollEndRef = useRef(null);
    const fileInputRef = useRef(null);

    const [input, setInput] = useState("");

    // Load messages when user changes
    useEffect(() => {
        if (selectedUser?._id) {
            getMessages(selectedUser._id);
        }
    }, [selectedUser, getMessages]);

    // Scroll to bottom when messages change
    useEffect(() => {
        scrollEndRef.current?.scrollIntoView({
            behavior: "smooth",
            block: "end",
        });
    }, [messages]);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!selectedUser?._id) return toast.error("Select a user first");
        if (!input.trim()) return;

        await sendMessage(selectedUser._id, input.trim());
        setInput("");
    };

    const handleSendImage = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        if (!file.type.startsWith("image/"))
            return toast.error("Please select an image");

        const reader = new FileReader();
        reader.onloadend = async () => {
            const base64 = reader.result;
            await sendMessage(selectedUser._id, "", base64);
            e.target.value = "";
        };
        reader.readAsDataURL(file);
    };

    if (!selectedUser || selectedUser._id === authUser?._id) {
        return (
            <div className="flex flex-col items-center justify-center gap-3 text-gray-400 bg-white/10 h-full">
                <img src={assets.logo} alt="logo" className="w-16" />
                <p className="text-lg font-medium text-white">
                    Eat Sleep Code Chat Repeat
                </p>
            </div>
        );
    }


    return (
        <div className="h-full flex flex-col rounded-xl overflow-hidden">

            {/* Header */}
            <div className="flex items-center justify-between py-3 px-4 border-b border-stone-500 shrink-0">
                <div className="flex items-center gap-3">
                    <img
                        src={selectedUser.profilePic || assets.avatar_icon}
                        alt="user"
                        className="w-10 h-10 rounded-full object-cover"
                    />

                    <div className="flex flex-col leading-4">
                        <div className="flex items-center gap-2">
                            <p className="text-white font-medium">
                                {selectedUser.fullName}
                            </p>

                            <span
                                className={`w-2 h-2 rounded-full ${onlineUser?.includes(selectedUser._id)
                                    ? "bg-green-500"
                                    : "bg-gray-400"
                                    }`}
                            />
                        </div>

                    </div>
                </div>

                <img
                    onClick={() => setSelectedUser(null)}
                    src={assets.arrow_icon}
                    alt="back"
                    className="md:hidden w-7 h-7 cursor-pointer"
                />
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((msg) => {
                    const isMe = msg.senderId === authUser?._id;
                    const key = msg._id || msg.id;

                    return (
                        <div
                            key={key}
                            className={`flex items-end gap-2 ${isMe ? "justify-end" : "justify-start"
                                }`}
                        >
                            {!isMe && (
                                <img
                                    src={selectedUser.profilePic || assets.avatar_icon}
                                    alt="sender"
                                    className="w-8 h-8 rounded-full object-cover"
                                />
                            )}

                            <div className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}>
                                {/* Bubble */}
                                <div
                                    className={` break-words
                                              max-w-[90%] sm:max-w-[70%] md:max-w-[60%] min-w-[80px]
                                         ${isMe
                                            ? "bg-[#0A84FF] text-white rounded-2xl rounded-br-md"
                                            : "bg-[#2C2C2E] text-white rounded-2xl rounded-bl-md"
                                        } `}
                                >
                                    {msg.image && (
                                        <img
                                            src={msg.image}
                                            alt="sent"
                                            className="w-full max-w-[320px] p-1 bg-[#2C2C2E] rounded-xl"
                                            loading="lazy"
                                        />
                                    )}

                                    {msg.text && (
                                        <p className="px-5 py-3 text-sm text-white whitespace-pre-wrap break-words">
                                            {msg.text}
                                        </p>
                                    )}
                                </div>

                                {/* Time + Seen */}
                                <div className="mt-1 flex items-center gap-2">
                                    <span className="text-[10px] text-gray-300">
                                        {formatMsgTime(msg.createdAt)}
                                    </span>

                                    {isMe && (
                                        <span className="text-[10px] text-gray-300">
                                            {msg.seen ? "Seen" : "Sent"}
                                        </span>
                                    )}
                                </div>
                            </div>

                            {isMe && (
                                <img
                                    src={authUser?.profilePic || assets.avatar_icon}
                                    alt="me"
                                    className="w-8 h-8 rounded-full object-cover"
                                />
                            )}
                        </div>
                    );
                })}

                <div ref={scrollEndRef} />
            </div>

            {/* Input Area */}
            <form
                onSubmit={handleSendMessage}
                className="flex items-center p-3 border-t border-stone-500 gap-2 shrink-0"
            >
                <input
                    ref={fileInputRef}
                    type="file"
                    hidden
                    accept="image/*"
                    onChange={handleSendImage}
                />

                <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="p-2 rounded-full bg-[#2a273c] hover:bg-[#3b3270]"
                >
                    <img
                        src={assets.gallery_icon}
                        alt="gallery"
                        className="w-6 h-6"
                    />
                </button>

                <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    type="text"
                    placeholder="Type a message..."
                    className="flex-1 rounded-full px-4 py-2 bg-[#1e1b2c] text-white outline-none"
                />

                <button
                    type="submit"
                    className="p-2 rounded-full bg-[#3b32a0] hover:bg-[#4b3bd0]"
                >
                    <img
                        src={assets.send_button}
                        alt="send"
                        className="w-6 h-6"
                    />
                </button>
            </form>
        </div>
    );
};


export default ChatContainer;