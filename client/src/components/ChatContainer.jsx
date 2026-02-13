import React, { useEffect, useRef, useState } from 'react';
import assets, { messagesDummyData as dummyData } from '../assets/assets';
import { formatMsgTime } from '../lib/utlis';

const ChatContainer = ({ selectedUser, setSelectUser }) => {
    const scrollEndRef = useRef(null);
    const [messages, setMessages] = useState(dummyData);

    // Scroll to bottom whenever messages or selectedUser change
    const scrollToBottom = () => {
        if (scrollEndRef.current) {
            scrollEndRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
        }
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, selectedUser]);

    if (!selectedUser) {
        return (
            <div className='flex flex-col items-center justify-center gap-2 text-gray-500 bg-white/10 max-md:hidden h-full'>
                <img src={assets.logo} alt="" className='w-16' />
                <p className='text-lg font-medium text-white'>Eat Sleep Code Chat Repeat</p>
            </div>
        );
    }

    return (
        <div className='h-full flex flex-col rounded-xl overflow-hidden'>

            {/* Header */}
            <div className='flex items-center justify-between py-3 px-4 border-b border-stone-500 shrink-0'>
                <div className='flex items-center gap-3'>
                    <img
                        src={selectedUser.profilePic || assets.avatar_icon}
                        alt=""
                        className='w-9 h-9 rounded-full'
                    />
                    <div className='flex items-center gap-2'>
                        <p className='text-lg text-white font-medium'>
                            {selectedUser.fullName || 'User Name'}
                        </p>
                        <span className='w-2 h-2 rounded-full bg-green-500'></span>
                    </div>
                </div>
                <div className='flex items-center gap-3'>
                    <img
                        onClick={() => setSelectUser(null)}
                        src={assets.arrow_icon}
                        alt="back"
                        className='md:hidden w-7 h-7 cursor-pointer'
                    />
                    <img
                        src={assets.help_icon}
                        alt="help"
                        className='md:hidden w-7 h-7 cursor-pointer'
                    />
                </div>
            </div>

            {/* Chat Area (Scrollable) */}
            <div className='flex-1 overflow-y-auto p-4 space-y-3'>
                {messages.map((msg, index) => {
                    const isMe = msg.senderId === '680f5116f10f3cd28382ed02';
                    return (
                        <div key={index} className={`flex items-end ${isMe ? 'justify-end' : 'justify-start'}`}>
                            {!isMe && (
                                <img
                                    src={selectedUser.profilePic}
                                    alt="sender"
                                    className='w-8 h-8 rounded-full mr-2'
                                />
                            )}

                            <div className={`flex flex-col max-w-[70%] ${isMe ? 'items-end' : 'items-start'}`}>
                                <div className={`${isMe
                                    ? 'bg-blue-500 text-white rounded-bl-3xl rounded-tl-3xl rounded-tr-xl'
                                    : 'bg-gray-700 text-white rounded-br-3xl rounded-tr-3xl rounded-tl-xl'
                                    } p-2 break-words`}>
                                    {msg.text}
                                </div>
                                <span className='text-[10px] text-gray-300 mt-1'>
                                    {formatMsgTime(msg.createdAt)}
                                </span>
                            </div>

                            {isMe && (
                                <img
                                    src={assets.avatar_icon}
                                    alt="me"
                                    className='w-8 h-8 rounded-full ml-2'
                                />
                            )}
                        </div>
                    );
                })}
                <div ref={scrollEndRef}></div>
            </div>

            {/* Input Box (Fixed Bottom) */}
            <div className='flex items-center p-3 border-t border-stone-500 gap-2 shrink-0'>

                {/* Hidden File Input */}
                <input
                    type="file"
                    id="fileInput"
                    hidden
                    onChange={(e) => console.log(e.target.files[0])}
                />

                {/* Gallery Button */}
                <button
                    onClick={() => document.getElementById("fileInput").click()}
                    className='p-2 rounded-full bg-[#2a273c] hover:bg-[#3b3270]'
                >
                    <img src={assets.gallery_icon} alt="gallery" className='w-6 h-6' />
                </button>

                <input
                    type="text"
                    placeholder="Type a message..."
                    className='flex-1 rounded-full px-4 py-2 bg-[#1e1b2c] text-white outline-none'
                />

                <button className='p-2 rounded-full bg-[#3b32a0] hover:bg-[#4b3bd0]'>
                    <img src={assets.send_button} alt="send" className='w-6 h-6' />
                </button>

            </div>

        </div>
    );
};

export default ChatContainer;