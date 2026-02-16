import { createContext, useState, useContext, useEffect, useCallback } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { AuthContext } from "./AuthContext.jsx";

const backendUrl = import.meta.env.VITE_BACKEND_URL;
axios.defaults.baseURL = backendUrl;

export const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [unseenMessages, setUnseenMessages] = useState({});

  const { socket } = useContext(AuthContext);

  // Users for sidebar
  const getUsers = useCallback(async () => {
    try {
      const { data } = await axios.get("/api/messages/users");
      if (data.success) {
        setUsers(data.users || []);
        setUnseenMessages(data.unseenMessages || {});
      } else {
        toast.error(data.message || "Failed to load users");
      }
    } catch (e) {
      toast.error(e?.response?.data?.message || e.message);
    }
  }, []);

  // Get messages with a particular user
  const getMessages = useCallback(async (userId) => {
    try {
      const { data } = await axios.get(`/api/messages/${userId}`);
      if (data.success) {
        setMessages(data.messages || []);
      } else {
        toast.error(data.message || "Failed to load messages");
      }
    } catch (e) {
      toast.error(e?.response?.data?.message || e.message);
    }
  }, []);

  // Send message (text or image)
  const sendMessage = useCallback(async (receiverId, text = "", image = "") => {
    try {
      if (!receiverId) return toast.error("No receiver selected");
      if (!text?.trim() && !image) return;

      const payload = {};
      if (text?.trim()) payload.text = text.trim();
      if (image) payload.image = image;

      const { data } = await axios.post(`/api/messages/send/${receiverId}`, payload);

      if (data.success) {
        setMessages((prev) => [...prev, data.newMessage]);
      } else {
        toast.error(data.message || "Failed to send message");
      }
    } catch (e) {
      toast.error(e?.response?.data?.message || e.message);
    }
  }, []);

  // Socket: new incoming message
  useEffect(() => {
    if (!socket) return;

    const handler = async (newMessage) => {
      // If current chat is open with sender, mark seen
      if (selectedUser && newMessage.senderId === selectedUser._id) {
        setMessages((prev) => [...prev, { ...newMessage, seen: true }]);

        try {
          await axios.put(`/api/messages/mark/${newMessage._id}`);
        } catch (_) {}
      } else {
        // increment unseen count
        setUnseenMessages((prev) => ({
          ...prev,
          [newMessage.senderId]: (prev[newMessage.senderId] || 0) + 1,
        }));
      }
    };

    socket.on("newMessage", handler);
    return () => socket.off("newMessage", handler);
  }, [socket, selectedUser]);

  const value = {
    messages,
    setMessages,
    users,
    setUsers,
    selectedUser,
    setSelectedUser,
    unseenMessages,
    setUnseenMessages,
    getUsers,
    getMessages,
    sendMessage,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};