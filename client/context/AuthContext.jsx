import { createContext, useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { io } from "socket.io-client";

const backendUrl = import.meta.env.VITE_BACKEND_URL;
axios.defaults.baseURL = backendUrl;

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [authUser, setAuthUser] = useState(null);
  const [onlineUser, setOnlineUser] = useState([]);
  const [socket, setSocket] = useState(null);






  // handle socket connection
  const connectSocket = (userData) => {
    if (!userData || socket?.connected) return;

    const newSocket = io(backendUrl, {
      query: { userId: userData._id },
    });

    setSocket(newSocket);

    newSocket.on("getOnlineUsers", (userIds) => {
      setOnlineUser(userIds);
    });
  };

  const disconnectSocket = () => {
    if (socket) {
      socket.off("getOnlineUsers");
      socket.disconnect();
      setSocket(null);
    }
  };

  const CheckAuth = async () => {
    try {
      const { data } = await axios.get("/api/auth/check");
      if (data.success) {
        setAuthUser(data.user);
        connectSocket(data.user);
      }
    } catch (e) {
      console.error(e);
      toast.error(e?.response?.data?.message || e.message);
    }
  };

  // login/register function
  const login = async (endpoint, credentials) => {
    try {
      const { data } = await axios.post(`/api/auth/${endpoint}`, credentials);

      if (!data.success) {
        toast.error(data.message);
        return;
      }

      const newToken = data.token;
      const user = data.userData;

      axios.defaults.headers.common["token"] = newToken;
      localStorage.setItem("token", newToken);
      setToken(newToken);

      setAuthUser(user);
      connectSocket(user);


      toast.success(data.message);
    } catch (e) {
      toast.error(e?.response?.data?.message || e.message);
    }
  };

  const logout = async () => {
    localStorage.removeItem("token");
    setToken(null);
    setAuthUser(null);
    setOnlineUser([]);

    setSelectedUser(null);
    setMessages([]);
    setUsers([]);
    setUnseenMessages({});


    delete axios.defaults.headers.common["token"];
    disconnectSocket();
    toast.success("Logged out successfully");


  };

  const updateProfile = async (body) => {
    try {
      const { data } = await axios.put("/api/auth/update-profile", body);

      if (data.success) {
        setAuthUser(data.userData);
        toast.success(data.message || "Profile updated successfully");
      } else {
        toast.error(data.message);
      }
    } catch (e) {
      toast.error(e?.response?.data?.message || e.message);
    }
  };



  // when token changes, set header + check auth
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common["token"] = token;
      CheckAuth();
    } else {
      disconnectSocket();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const value = {
    axios,
    authUser,
    onlineUser,
    socket,
    login,
    logout,
    updateProfile,
    token,
    setToken,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};