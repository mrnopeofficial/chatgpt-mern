import React, { useState } from 'react';
import axios from 'axios';
import ChatUI, { Bubble, useMessages } from '@chatui/core';
import '@chatui/core/dist/index.css';

const Chat = () => {
    const { messages, appendMsg, setTyping } = useMessages([]);
    const [input, setInput] = useState('');

    const handleSend = async (type, val) => {
        if (type === 'text' && val.trim()) {
            // User's message
            appendMsg({
                type: 'text',
                content: { text: val },
                position: 'right',
            });

            setTyping(true); // Show typing indicator

            try {
                const response = await axios.post('http://localhost:5000/api/chats', { message: val });
                const botResponse = response.data.botResponse;

                // Bot's response
                setTimeout(() => {
                    appendMsg({
                        type: 'text',
                        content: { text: botResponse },
                    });
                    setTyping(false);
                }, 1000); // Simulate typing delay
            } catch (error) {
                console.error('Error sending message:', error);
                appendMsg({
                    type: 'text',
                    content: { text: 'Error occurred. Please try again.' },
                });
            }
        }
    };

    const renderMessageContent = (msg) => {
        const { content } = msg;
        return <Bubble content={content.text} />;
    };

    return (
        <ChatUI
            locale="en-US"
            navbar={{ title: 'ChatMi' }}
            messages={messages}
            renderMessageContent={renderMessageContent}
            onSend={handleSend}
            placeholder="Type a message..."
            
        />
    );
};

export default Chat;
