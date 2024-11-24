import { useEffect, useRef } from 'react'
import ChatHeader from './ChatHeader';
import MessageInput from './MessageInput';
import { useChatStore } from '../store/useChatStore';
import MessageSkeleton from './skeleton/MessageSkeleton';
import { useAuthStore } from '../store/useAuthStore';
import { formatMessageTime } from '../lib/utils';

const ChatContainer = () => {

    const {selectedUser,messages,getMessages,isMessagesLoading,subscribeToMessage,unSubscribeFromMessage} = useChatStore();
const {authUser} = useAuthStore();
let messageEndRef = useRef(null);
    useEffect(() => {
        if(selectedUser){
            getMessages(selectedUser._id);
        }
        subscribeToMessage();

        return ()=>unSubscribeFromMessage();
    }, [selectedUser,getMessages,subscribeToMessage,unSubscribeFromMessage]);

    useEffect(() => {
        if(messageEndRef.current && messages)
        messageEndRef?.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]); 

    if(isMessagesLoading){
        return <div className='flex flex-1 flex-col overflow-auto'>
            <ChatHeader/    >
            <MessageSkeleton/>
        </div>
    }

  return (
    <div className='flex-1 flex flex-col overflow-auto'>
        <ChatHeader/>

        <div className='flex-1 overflow-y-auto p-4 space-y-4'>
            {
                messages.length > 0 && messages.map((message) => (
                    <div key={message._id} ref={messageEndRef} className={`chat ${message.senderId === authUser._id ? "chat-end" : "chat-start"}`}>
                        <div className="chat-image avatar">
                            <div className="size-10 rounded-full">
                                <img src={message.senderId === authUser._id ? authUser.profilePic || "/images.jpeg" : selectedUser.profilePic} alt={"profile pic"} />
                            </div>
                        </div>
                        <div className="chat-header mb-1">
                            <time className="text-xs opacity-50 ml-1">{formatMessageTime(message.createdAt)}</time>
                        </div>
                        <div className="chat-bubble flex">
                            {
                                message.image && (
                                    <img src={message.image}
                                    alt="attachment"
                                    className='sm:max-w-[200px] rounded-md mb-2'
                                    />
                                )
                            }
                            {
                                message.text && <p>{message.text}</p>
                            }
                        </div>
                    </div>
                ))
            }
        </div>

        <MessageInput/> 
    </div>
  )
}

export default ChatContainer