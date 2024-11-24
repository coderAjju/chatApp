import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import { useAuthStore } from "./useAuthStore";

export const useChatStore = create((set, get) => ({
  messages: [],
  users: [],
  selectedUser: null,
  isUsersLoading: false,
  isMessagesLoading: false,

  getUsers: async () => {
    set({ isUsersLoading: true });
    try {
      const res = await axiosInstance.get("/messages/users");
      set({ users: res.data });
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isUsersLoading: false });
    }
  },

  getMessages: async (userId) => {
    set({ isMessagesLoading: true });
    try {
      const res = await axiosInstance.get(`/messages/${userId}`);
      console.log(res);
      set({ messages: res.data });
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isMessagesLoading: false });
    }
  },
  sendMessage: async (messageData) => {
    const { selectedUser, messages } = get();
    try {
      const res = await axiosInstance.post(
        `/messages/send/${selectedUser._id}`,
        messageData
      );
      console.log("sending response ", res);
      const updatedMessages = [...messages];
      updatedMessages.push(res.data);
      set({ messages: updatedMessages });
    } catch (error) {
      toast.error(error.response.data.message);
    }
  },

  subscribeToMessage:()=>{  // this event work's when we open a conversation and send message
    const {selectedUser} = get();
    if(!selectedUser) return;
    const socket = useAuthStore.getState().socket;

    socket.on("newMessage",(newMessage)=>{

      if(newMessage.senderId !== selectedUser._id) return; // this statement prevent to broardcast the message  

      set({
        messages:[...get().messages,newMessage],
      })
    })
  },

  unSubscribeFromMessage:()=>{
    const socket = useAuthStore.getState().socket;
    socket.off("newMessage");
  },

  setSelectedUser: (selectedUser) => set({ selectedUser }),
}));
  