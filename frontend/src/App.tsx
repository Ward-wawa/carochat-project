import Navbar from "./components/Navbar.tsx";
import {Routes, Route, Navigate} from "react-router-dom";
import HomePage from "./Pages/HomePage.tsx";
import SignUpPage from "./Pages/SignUpPage.tsx";
import SettingsPage from "./Pages/SettingsPage.tsx";
import LoginPage from "./Pages/LoginPage.tsx";
import ProfilePage from "./Pages/ProfilePage.tsx";
import {useAuthStore} from "./store/useAuthStore.ts";
import {useEffect} from "react";
import {Loader} from "lucide-react"
import {Toaster} from "react-hot-toast";
import {useThemeStore} from "./store/useThemeStore.ts";

const App = () => {
    const {theme} = useThemeStore();
    const {authUser,checkAuth,isCheckingAuth} = useAuthStore()
    useEffect(() => {
        checkAuth();
    },[checkAuth])
    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
    }, [theme]);

    if(isCheckingAuth && !authUser) return (
        <div className="flex items-center justify-center h-screen">
            <Loader className="size-10 animate-spin" />
        </div>
    )

    return (
        <div>
            <Navbar />
                <Routes>
                    <Route path="/" element={authUser ? <HomePage/> : <Navigate to="/login" />} />
                    <Route path="/signup" element={!authUser ? <SignUpPage/> : <Navigate to="/"/>} />
                    <Route path="/login" element={!authUser ? <LoginPage/> : <Navigate to="/"/>} />
                    <Route path="/settings" element={<SettingsPage/>} />
                    <Route path="/profile" element={authUser ? <ProfilePage/> : <Navigate to="/login" />} />
                </Routes>
            <Toaster />
        </div>
    );
};

export default App;