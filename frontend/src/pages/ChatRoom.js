import React, { useState, useEffect, useRef } from 'react';
import SockJS from 'sockjs-client';
import { Stomp } from '@stomp/stompjs';
import Draggable from 'react-draggable';

function ChatRoom({ isOpen, onClose, initialUsername }) {
    const [stompClient, setStompClient] = useState(null);
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState('');
    const [username, setUsername] = useState(initialUsername || '');
    const [isSettingUsername, setIsSettingUsername] = useState(!initialUsername);
    const [connectedUsers, setConnectedUsers] = useState([]);
    const [isMinimized, setIsMinimized] = useState(false);
    const [newMessageCount, setNewMessageCount] = useState(0);
    const messageInputRef = useRef(null);
    const chatBoxRef = useRef(null);

    useEffect(() => {
        if (isOpen && !isSettingUsername) {
            const socket = new SockJS('http://olm.life/ws');
            const client = Stomp.over(socket);

            client.connect({}, () => {
                setStompClient(client);
                client.subscribe('/topic/public', (message) => {
                    const receivedMessage = JSON.parse(message.body);
                    setMessages((prevMessages) => [...prevMessages, receivedMessage]);
                    if (isMinimized) {
                        setNewMessageCount((prevCount) => prevCount + 1);
                        showNotification(receivedMessage);
                    }
                });
                client.subscribe('/topic/connectedUsers', (users) => {
                    setConnectedUsers(JSON.parse(users.body));
                });
                client.send("/app/chat.addUser", {}, JSON.stringify({sender: username, type: 'JOIN'}));
            });

            return () => {
                if (client.connected) {
                    client.send("/app/chat.removeUser", {}, JSON.stringify({sender: username, type: 'LEAVE'}));
                    client.disconnect();
                }
            };
        }
    }, [isOpen, isSettingUsername, username]);

    useEffect(() => {
        if (chatBoxRef.current) {
            chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
        }
    }, [messages]);

    const sendMessage = () => {
        if (stompClient && message) {
            const chatMessage = {
                sender: username,
                content: message,
                type: 'CHAT'
            };
            stompClient.send("/app/chat.sendMessage", {}, JSON.stringify(chatMessage));
            setMessage('');
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            if (isSettingUsername) {
                setIsSettingUsername(false);
            } else {
                sendMessage();
            }
        }
    };

    const toggleMinimize = () => {
        setIsMinimized(!isMinimized);
        if (!isMinimized) {
            setNewMessageCount(0);
        }
    };

    const showNotification = (message) => {
        if (Notification.permission === "granted") {
            new Notification(`New message from ${message.sender}`, {
                body: message.content
            });
        } else if (Notification.permission !== "denied") {
            Notification.requestPermission().then(permission => {
                if (permission === "granted") {
                    showNotification(message);
                }
            });
        }
    };

    if (!isOpen) return null;

    return (
        <Draggable handle=".handle">
            <div className={`fixed right-4 bottom-4 bg-gray-800 rounded-lg shadow-lg overflow-hidden transition-all duration-300 ${isMinimized ? 'w-64 h-12' : 'w-96 h-[80vh]'}`}>
                <div className="handle bg-gray-700 p-2 flex justify-between items-center cursor-move">
                    <h2 className="text-xl font-bold text-white">채팅방</h2>
                    <div>
                        <button onClick={toggleMinimize} className="text-white mr-2 hover:text-gray-300">
                            {isMinimized ? '□' : '—'}
                        </button>
                        <button onClick={onClose} className="text-white hover:text-gray-300">
                            ×
                        </button>
                    </div>
                </div>
                {!isMinimized && (
                    <div className="p-4 flex flex-col h-[calc(80vh-48px)]">
                        {isSettingUsername ? (
                            <div className="mb-4">
                                <input
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    onKeyPress={handleKeyPress}
                                    placeholder="닉네임을 입력하세요"
                                    className="w-full p-2 rounded bg-gray-700 text-white"
                                    autoFocus
                                />
                            </div>
                        ) : (
                            <>
                                <div className="flex-grow flex mb-4 overflow-hidden">
                                    <div ref={chatBoxRef} className="flex-grow overflow-y-auto mr-2 bg-gray-700 rounded p-2">
                                        {messages.map((msg, index) => (
                                            <div key={index} className={`mb-2 p-2 rounded ${msg.sender === username ? 'bg-blue-600 text-white self-end' : 'bg-gray-600'}`}>
                                                <span className="font-semibold">{msg.sender}: </span>
                                                <span>{msg.content}</span>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="w-1/4 overflow-y-auto bg-gray-700 rounded p-2">
                                        {connectedUsers.map((user, index) => (
                                            <div key={index} className="mb-1 text-white">{user}</div>
                                        ))}
                                    </div>
                                </div>
                                <div className="flex">
                                    <input
                                        type="text"
                                        value={message}
                                        onChange={(e) => setMessage(e.target.value)}
                                        onKeyPress={handleKeyPress}
                                        placeholder="메시지를 입력하세요"
                                        className="flex-grow p-2 rounded-l bg-gray-700 text-white"
                                        ref={messageInputRef}
                                    />
                                    <button
                                        onClick={sendMessage}
                                        className="bg-blue-500 text-white px-4 py-2 rounded-r hover:bg-blue-600"
                                    >
                                        전송
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                )}
                {isMinimized && newMessageCount > 0 && (
                    <div className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs">
                        {newMessageCount}
                    </div>
                )}
            </div>
        </Draggable>
    );
}

export default ChatRoom;
