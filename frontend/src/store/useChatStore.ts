import { create } from "zustand"
import toast from "react-hot-toast";
import {axiosInstance} from "../lib/axios.ts";
import {useAuthStore, userDB} from "./useAuthStore.ts";

export type MessageType = {
    _id?: string;
    __v?: number;
    senderId?: string;
    receiverId?: string;
    image?: string;
    text: string;
    createdAt?: string;
}

interface ChatState {
    messages: [MessageType] | [] | any;
    users: [userDB] | [];
    selectedUser: userDB | null;
    isMessagesLoading: boolean;
    isUsersLoading: boolean;
    getUsers:()=>Promise<void>;
    getMessages:(userId:string)=>Promise<void>;
    sendMessage: (message:MessageType) => Promise<void>;
    subscribeToMessages:()=>void;
    unsubscribeFromMessages:()=>void;
    setSelectedUser:(selectedUser:userDB|null)=>void;
}

export const useChatStore = create<ChatState>((set,get)=>({
    messages:[],
    users:[],
    selectedUser:null,
    isMessagesLoading:false,
    isUsersLoading:false,

    getUsers: async()=>{
        set({isUsersLoading:true});
        try{
            const response=await axiosInstance.get("/messages/users");
            set({users:response.data});
        }catch(err:any){
            console.log(err);
            toast.error(err.response.data.message);
        }finally {
            set({isUsersLoading:false});
        }
    },

    getMessages: async(userId:string)=>{
        set({isMessagesLoading:true});
        try{
            const response=await axiosInstance.get(`/messages/${userId}`);
            set({messages:response.data});
        }catch (err:any){
            console.log(err);
            toast.error(err.response.data.message);
        }finally {
            set({isMessagesLoading:false});
        }
    },

    sendMessage: async (messageData) => {
        const { selectedUser, messages } = get();
        try {
            if(selectedUser){
                const res = await axiosInstance.post(`/messages/send/${selectedUser._id}`, messageData);
                set({ messages: [...messages, res.data] });
            }
        } catch (error:any) {
            toast.error(error.response.data.message);
        }
    },

    subscribeToMessages:()=>{
        const {selectedUser} = get();
        if(!selectedUser){
            return;
        }
        const socket = useAuthStore.getState().socket
        if(!socket){return}
        socket.on("newMessage",(newMessage)=>{
            const isMessageSentFromSelectedUser = newMessage.senderId === selectedUser._id;
            if (!isMessageSentFromSelectedUser) return;
            set({messages:[...get().messages,newMessage]});
        })
    },

    unsubscribeFromMessages:()=>{
        const socket = useAuthStore.getState().socket;
        socket?.off("newMessage");
    },

    setSelectedUser: (selectedUser:userDB | null)=>set({selectedUser:selectedUser}),

}))