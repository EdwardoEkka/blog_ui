import React, { useState, useEffect } from "react";
import io from "socket.io-client";
import { useUser } from "./userContext";
import "./styles/data.css";

const Chat = ({ person, name }) => {
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const { username, objectId } = useUser();

  useEffect(() => {
    const newSocket = io("http://localhost:5000");

    newSocket.on("connect", () => {
      console.log("Connected to server");
    });

    newSocket.on("chat message", (msg) => {
      if (msg.receiver === objectId || msg.sender === objectId) {
        setMessages((prevMessages) => [...prevMessages, msg]);
      }
    });

    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, [objectId]); // Run effect whenever objectId changes

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!socket || !inputMessage.trim()) return;

    const messageData = {
      sender: objectId,
      receiver: person,
      message: inputMessage,
      sender_name: username,
    };

    socket.emit("chat message", messageData);
    setInputMessage("");
  };

  return (
    <div>
      <ul className="message-list">
        {messages.map((msg, index) => (
          <li
            key={index}
            className={`message-item ${
              msg.sender === objectId ? "sent" : "received"
            }`}
          >
            <div
              className="message-bubble"
              style={{
                backgroundColor:
                  msg.sender === objectId ? "#dcf8c6" : "#ffffff",
              }}
            >
              <p className="message-text">
                {msg.sender === objectId ? "You: " : `${msg.sender_name}: `}
                {msg.message}
              </p>
            </div>
          </li>
        ))}
      </ul>

      <form onSubmit={handleSubmit} className="frm">
        <textarea
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
};

export default Chat;
