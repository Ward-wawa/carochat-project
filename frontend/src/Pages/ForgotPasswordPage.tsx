import {Loader2, Mail, MessageSquare} from "lucide-react";
import {Link} from "react-router-dom";
import ImagePattern from "../components/ImagePattern.tsx";
import {FormEvent, useState} from "react";
import {useAuthStore} from "../store/useAuthStore.ts";

const ForgotPasswordPage = () => {
    const [email, setEmail] = useState("");
    const {isForgotPasswordSendingEmail,forgotPasswordSendEmail} = useAuthStore();
    const handleSubmit= (e:FormEvent<HTMLFormElement>)=>{
        e.preventDefault();
        if(!email) return;
        forgotPasswordSendEmail(email);
    }
    return (
        <div className="h-screen grid lg:grid-cols-2">

            <div className="flex flex-col justify-center items-center p-6 sm:p-12">
                <div className="w-full max-w-md space-y-8">

                    <div className="text-center mb-8">
                        <div className="flex flex-col items-center gap-2 group">
                            <div
                                className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20
              transition-colors"
                            >
                                <MessageSquare className="w-6 h-6 text-primary" />
                            </div>
                            <h1 className="text-2xl font-bold mt-2">Enter Your Email!</h1>
                            <p className="text-base-content/60">Please enter your account's email, we will send you a password reset link to the provided email.</p>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text font-medium">Email</span>
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Mail className="h-5 w-5 text-base-content/40" />
                                </div>
                                <input
                                    type="email"
                                    className={`input input-bordered w-full pl-10`}
                                    placeholder="you@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                        </div>


                        <button type="submit" className="btn btn-primary w-full" disabled={isForgotPasswordSendingEmail}>
                            {isForgotPasswordSendingEmail ? (
                                <>
                                    <Loader2 className="h-5 w-5 animate-spin" />
                                    Loading...
                                </>
                            ) : (
                                "Send Email"
                            )}
                        </button>
                    </form>

                    <div className="text-center">
                        <p className="text-base-content/60">
                            <Link to="/login" className="link link-primary">
                                Back To Login Page
                            </Link>
                        </p>
                    </div>
                </div>
            </div>

            <ImagePattern
                title={"Welcome back!"}
                subtitle={"Sign in to continue your conversations and catch up with your messages."}
            />
        </div>
    );
};

export default ForgotPasswordPage;