import { create } from "zustand";
import {axiosInstance} from "../lib/axios.ts";
import toast from "react-hot-toast";
import {io, Socket} from "socket.io-client";

const BASE_URL = import.meta.env.MODE === "development" ? "http://localhost:5002" : "/";
export type userDB = {
    createdAt: string;
    UpdatedAt: string;
    email: string;
    fullName: string;
    name?:string; // ???
    profilePic: string;
    _id: string;
    __v:number;
    user?: userDB;
}

export type AuthUserType = {
    message: string;
    user: userDB;
    createdAt: string;
    UpdatedAt: string;
    email: string;
    fullName: string;
    name?:string; // ???
    profilePic: string;
    _id: string;
    __v:number;
}

type user = {
    fullName: string;
    email: string;
    password: string;
}

type loginUser = {
    email: string;
    password: string;
}

type profilePicture = {
    profilePic: string|ArrayBuffer;
}

interface AuthState {
    authUser: AuthUserType | userDB | null;
    isFullNameLoading:boolean;
   // isForgotPasswordSendingEmail:boolean;
    isCheckingAuth: boolean;
    isSigningUp: boolean;
    isLoggingIn: boolean;
    isUpdatingProfile: boolean;
    onlineUsers: String[] ;
    socket:null | Socket;
    checkAuth: () => Promise<void>;
    signup: ({}:user) => Promise<void>;
    login: ({}:loginUser) => Promise<void>;
    logout: () => Promise<void>;
    updateProfile: ({}:profilePicture)=>Promise<void>;
   // forgotPasswordSendEmail:(email:string)=>Promise<void>;
    updateFullName: (name:string)=>Promise<void>
    connectSocket:()=>void;
    disconnectSocket: ()=>void;
}

export const useAuthStore = create<AuthState>((set,get)=>({
    authUser:null,
    isCheckingAuth: true,
    isFullNameLoading:false,
   // isForgotPasswordSendingEmail:false,
    isSigningUp: false,
    isLoggingIn: false,
    isUpdatingProfile: false,
    onlineUsers:[],
    socket:null,

    checkAuth: async () => {
        try
        {
            const res = await axiosInstance.get("/auth/check");
            set({authUser:res.data});
            get().connectSocket();
        }
        catch(err){
        console.log(err);
            set({authUser:null});
        }
        finally{
            set({isCheckingAuth:false});
        }
        },

    signup: async (data:user) => {
        set({isSigningUp:true})
        try{
            const res = await axiosInstance.post("/auth/signup",data);
            set({authUser:res.data});
            toast.success("Account created successfully");
            get().connectSocket()
        }
        catch(err:any){
            toast.error(err.response.data.message);
        }finally {
            set({isSigningUp:false});
        }
    },

    login: async (data:loginUser) => {
        try{
            set({isLoggingIn:true});
            const res = await axiosInstance.post("/auth/login",data);
            set({authUser:res.data});
            toast.success("Logged in successfully");
            get().connectSocket()
        }catch(err:any){
            console.log(err);
            toast.error(err.response.data.message);
        }finally {
            window.location.reload()
            set({isLoggingIn:false});
        }
    },

    logout: async ()=>{
        try{
            await axiosInstance.post("/auth/logout");
            set({authUser:null});
            toast.success("Logged out successfully");
            get().disconnectSocket();
        }catch(err){
            console.log(err);
            toast.error("Could not log out");
        }
    },

    updateProfile: async (data) => {
        set({ isUpdatingProfile: true });
        try {
            const res = await axiosInstance.put("/auth/update-profile", data);
            set({ authUser: res.data });
            toast.success("Profile updated successfully");
        } catch (error:any) {
            console.log("error in update profile:", error);
            toast.error(error.response.data);
        } finally {
            set({ isUpdatingProfile: false });
        }
    },

    updateFullName: async (name:string) => {
        set({ isFullNameLoading:true});
        try{
            const res = await axiosInstance.patch("/auth/update-full-name",{fullName:name});
            set({authUser:res.data});
        }catch(err:any){
            console.log(err);
            toast.error(err.response.data.message);
        }finally {
            set({isFullNameLoading:false})
        }
    },
/*
    forgotPasswordSendEmail: async (email:string) => {
        set({isForgotPasswordSendingEmail:true});
        try{
            const res = await axiosInstance.post("/auth/forgot-password", {email});
            toast.success(res.data.message)
        }catch (e:any) {
            console.log(e);
            toast.error(e.response.data.message);
        }finally {
            set({isForgotPasswordSendingEmail:false})
        }
    },
*/
    connectSocket: ()=> {
        const {authUser} = get();
        if(!authUser || get().socket?.connected){return}
        const socket = io(BASE_URL,{
            query:{
                userId:authUser.user?._id
            }
        });
        socket.connect();
        set({socket:socket});

        socket.on("getOnlineUsers",(userIds)=>{
            set({onlineUsers:userIds});
        })
    },

    disconnectSocket:()=>{
        if(get().socket?.connected) get().socket?.disconnect();
    },
}))