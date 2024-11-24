import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { io } from "socket.io-client";

const BASE_URL =
  import.meta.env.MODE === "development" ? "http://localhost:8000" : "/";

export const useAuthStore = create((set, get) => ({
  authUser: null,
  isSigningUp: false,
  isLogining: false,
  isUpdatingProfile: false,
  isCheckingAuth: true,
  onlineUsers: [],
  socket: null,

  checkAuth: async () => {
    try {
      const response = await axiosInstance.get(`/auth/check-auth`);
      set({ authUser: response.data });
      get().connectSocket();
    } catch (error) {
      console.log("Error in check auth: ", error);
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  signup: async (data) => {
    set({ isSigningUp: true });
    try {
      const res = await axiosInstance.post(`/auth/signup`, data);
      set({ authUser: res.data.user });
      toast.success("User created successfully");
      get().connectSocket();
    } catch (error) {
      toast.error(error.response.data.error || error.message);
    } finally {
      set({ isSigningUp: false });
    }
  },

  login: async (data) => {
    set({ isLoggingIn: true });
    try {
      const res = await axiosInstance.post("/auth/login", data);
      set({ authUser: res.data.user });
      toast.success("Logged in successfully");
      get().connectSocket();
    } catch (error) {
      toast.error(error.response.data.error || error.message);
    } finally {
      set({ isLoggingIn: false });
    }
  },

  logout: async () => {
    try {
      const res = await axiosInstance.post(`/auth/logout`);
      toast.success(res.data.message);
      set({ authUser: null });
      get().disConnectSocket();
    } catch (error) {
      console.log("Error in logout: ", error);
      toast.error(error.response.data.message || error.message);
    }
  },
  updateProfile: async (data) => {
    try {
      const res = await axiosInstance.put("/auth/update-profile", data);
      set({ authUser: res.data });
      toast.success("Profile updated successfully");
    } catch (error) {
      console.log("error in update profile: ", error);
      toast.error(error.response.data.message || error.message);
    } finally {
      set({ isUpdatingProfile: false });
    }
  },
  connectSocket: async () => {
    const { authUser } = get();
    if (!authUser || get().socket?.connected) return;
    const socket = io(BASE_URL, {
      query: {
        userId: authUser._id,
      },
    });

    socket.connect();
    set({ socket: socket });
    socket.on("getOnlineUsers", (users) => {
      set({ onlineUsers: users });
    });
  },
  disConnectSocket: () => {
    get().socket.disconnect();
  },
}));
