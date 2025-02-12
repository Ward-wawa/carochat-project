import {MessageType, useChatStore} from "../store/useChatStore.ts";
import {useEffect, useRef} from "react";
import MessageSkeleton from "../skeletons/MessageSkeleton.tsx";
import ChatHeader from "./ChatHeader.tsx";
import MessageInput from "./MessageInput.tsx";
import {useAuthStore} from "../store/useAuthStore.ts";
import {formatMessageTime} from "../lib/FormatTime.ts";

const ChatContainer = () => {
    const {messages,getMessages,isMessagesLoading,selectedUser,subscribeToMessages,unsubscribeFromMessages} = useChatStore();
    const {authUser} = useAuthStore();

    const messageEndRef = useRef<HTMLDivElement>(null);
    useEffect(()=>{
        if(selectedUser)
        getMessages(selectedUser?._id)
        subscribeToMessages();
        return () => unsubscribeFromMessages();
    },[selectedUser?._id,getMessages])

    useEffect(() => {
        if(messageEndRef.current && messages)
        {
            messageEndRef.current.scrollIntoView({behavior: "smooth"});
        }
    }, [messages]);

    if(isMessagesLoading) return <div className="flex flex-col flex-1 overflow-auto">
        <ChatHeader />
        <MessageSkeleton/>
        <MessageInput />
    </div>

    return (
        <div className="flex flex-col flex-1 overflow-auto">
            <ChatHeader />
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {messages.map((message:MessageType) => (
                        <div
                            ref={messageEndRef}
                            key={message._id}
                            className={`chat ${message.senderId === authUser?.user?._id ? "chat-end" : "chat-start"}`}>
                            <div className="chat-image avatar">
                                <div className="size-10 rounded-full border">
                                    <img src={message.senderId === authUser?.user?._id
                                        ? authUser?.user?.profilePic || "/avatar.png"
                                        : selectedUser?.profilePic || "/avatar.png"}
                                         alt="avatar"/>
                                </div>
                            </div>
                            <div className="chat-header mb-1">
                                <time className="text-xs ml-1 opacity-50">{message.createdAt && formatMessageTime(message.createdAt)}</time>
                            </div>
                            <div className="chat-bubble flex flex-col">
                                {message.image && (
                                    <img
                                        src={message.image}
                                        alt="Attachment"
                                        className="sm:max-w-[200px] rounded-md mb-2"
                                    />
                                )}
                                {message.text && <p>{message.text}</p>}
                            </div>
                        </div>
                    ))}
                </div>
            <MessageInput/>
        </div>
    );
};

export default ChatContainer;