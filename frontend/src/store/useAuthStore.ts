
import { create } from "zustand";
import { axiosInstance } from "../lib/axios.ts";
import toast from "react-hot-toast";
import { io, Socket } from "socket.io-client";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5002";
const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || API_URL;


export type userDB = {
    createdAt: string;
    UpdatedAt: string;
    email: string;
    fullName: string;
    name?: string;
    profilePic: string;
    _id: string;
    __v: number;
    user?: userDB;
};

export type AuthUserType = {
    message: string;
    user: userDB;
    createdAt: string;
    UpdatedAt: string;
    email: string;
    fullName: string;
    name?: string;
    profilePic: string;
    _id: string;
    __v: number;
};

type user = {
    fullName: string;
    email: string;
    password: string;
};

type loginUser = {
    email: string;
    password: string;
};

type profilePicture = {
    profilePic: string | ArrayBuffer;
};

interface AuthState {
    authUser: AuthUserType | userDB | null;
    isFullNameLoading: boolean;
    isCheckingAuth: boolean;
    isSigningUp: boolean;
    isLoggingIn: boolean;
    isUpdatingProfile: boolean;
    onlineUsers: string[];
    socket: null | Socket;
    checkAuth: () => Promise<void>;

    signup: (data: user) => Promise<{ ok: boolean; data?: any; error?: any }>;
    login: (data: loginUser) => Promise<{ ok: boolean; data?: any; error?: any }>;

    logout: () => Promise<void>;
    updateProfile: (data: profilePicture) => Promise<void>;

    updateFullName: (name: string) => Promise<{ ok: boolean; data?: any; error?: any }>;

    connectSocket: () => void;
    disconnectSocket: () => void;
}


export const useAuthStore = create<AuthState>((set, get) => ({
    authUser: null,
    isCheckingAuth: true,
    isFullNameLoading: false,
    isSigningUp: false,
    isLoggingIn: false,
    isUpdatingProfile: false,
    onlineUsers: [],
    socket: null,

    checkAuth: async () => {
        try {
            const res = await axiosInstance.get("/auth/check");
            set({ authUser: res.data });
            get().connectSocket();
        } catch (err) {
            console.log("checkAuth error:", err);
            set({ authUser: null });
        } finally {
            set({ isCheckingAuth: false });
        }
    },

    signup: async (data: user) => {
        set({ isSigningUp: true });
        try {
            const res = await axiosInstance.post("/auth/signup", data);
            set({ authUser: res.data });
            toast.success("Account created successfully");
            get().connectSocket();
            return { ok: true, data: res.data };
        } catch (err: any) {
            const message = err?.response?.data?.message || err.message || "Signup failed";
            toast.error(message);
            return { ok: false, error: message };
        } finally {
            set({ isSigningUp: false });
        }
    },

    login: async (data: loginUser) => {
        set({ isLoggingIn: true });
        try {
            const res = await axiosInstance.post("/auth/login", data);
            set({ authUser: res.data });
            toast.success("Logged in successfully");
            get().connectSocket();
            return { ok: true, data: res.data };
        } catch (err: any) {
            console.log("login error:", err);
            const message = err?.response?.data?.message || err.message || "Login failed";
            toast.error(message);
            return { ok: false, error: message };
        } finally {
            set({ isLoggingIn: false });
        }
    },

    logout: async () => {
        try {
            await axiosInstance.post("/auth/logout");
            set({ authUser: null });
            toast.success("Logged out successfully");
        } catch (err) {
            console.log(err);
            toast.error("Could not log out");
        } finally {
            get().disconnectSocket();
        }
    },

    updateProfile: async (data) => {
        set({ isUpdatingProfile: true });
        try {
            const res = await axiosInstance.put("/auth/update-profile", data);
            set({ authUser: res.data });
            toast.success("Profile updated successfully");
        } catch (error: any) {
            console.log("error in update profile:", error);
            toast.error(error?.response?.data || "Update failed");
        } finally {
            set({ isUpdatingProfile: false });
        }
    },

    updateFullName: async (name: string) => {
        set({ isFullNameLoading: true });
        try {
            const res = await axiosInstance.patch("/auth/update-full-name", { fullName: name });
            set({ authUser: res.data });
            return { ok: true, data: res.data };
        } catch (err: any) {
            console.log(err);
            toast.error(err?.response?.data?.message || "Could not update name");
            return { ok: false, error: err };
        } finally {
            set({ isFullNameLoading: false });
        }
    },

    connectSocket: () => {
        const { authUser, socket } = get();
        if (!authUser || socket?.connected) return;

        // connect to SOCKET_URL so we don't hit the frontend host
        const sock = io(SOCKET_URL, {
            query: {
                userId: authUser.user?._id ?? (authUser as any)?._id,
            },
            transports: ["websocket"],
        });

        set({ socket: sock });

        sock.on("connect", () => {
            console.log("socket connected", sock.id);
        });

        sock.on("getOnlineUsers", (userIds: string[]) => {
            set({ onlineUsers: userIds });
        });

        sock.on("disconnect", () => {
            set({ socket: null });
        });
    },

    disconnectSocket: () => {
        const sock = get().socket;
        if (sock?.connected) {
            sock.disconnect();
            set({ socket: null });
        }
    },
}));
