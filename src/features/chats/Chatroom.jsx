import { useEffect, useState } from "react";
import styled from "styled-components";
import { supabase } from "../../api/supabase";
import FileAttachment from "../../ui/FileAttachment";
import Username from "../../ui/Username";
import { useUser } from "../authentication/useUser";
import { useChats } from "./useChats";

// Container for the entire chatroom

// Display area for messages
const MessageArea = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 1rem;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: inset 0px 0px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 1rem;
`;

// Input container for sending messages
const MessageInputContainer = styled.div`
  display: flex;
  gap: 1rem;
  padding: 0.5rem;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: inset 0px 0px 8px rgba(0, 0, 0, 0.1);
`;

// Styled input for typing messages
const MessageInput = styled.input`
  flex: 1;
  padding: 0.5rem;
  border-radius: 8px;
  border: 1px solid #ddd;
  font-size: 1rem;
  outline: none;

  &:focus {
    border-color: #0066cc;
  }
`;

// Styled send button
const SendButton = styled.button`
  background-color: #0066cc;
  color: white;
  padding: 0.6rem 1.2rem;
  border-radius: 8px;
  border: none;
  cursor: pointer;

  &:hover {
    background-color: #005bb5;
  }
`;

// Display each individual message with username
const MessageItem = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 10px;
`;

const MessageContent = styled.span`
  margin-left: 10px;
`;

const StyledImage = styled.img`
  width: 200px;
`;

export default function Chatroom() {
  const [messages, setMessages] = useState([]); // Corrected variable name
  const [file, setFile] = useState(null);
  const [text, setText] = useState("");
  const { mutate: insertChat } = useChats();
  useEffect(() => {
    const messageChannel = supabase
      .channel("chatroom")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "messages" },
        (payload) => {
          console.log("New message received:", payload);
          // Ensure payload.new exists before updating state
          if (payload.new) {
            setMessages((prevMessages) => [...prevMessages, payload.new]);
          }
        }
      )
      .on("error", (error) => {
        console.error("Real-time subscription error:", error);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(messageChannel);
    };
  }, []);

  function handleSendMessage() {
    if (file || text) {
      const messageData = {
        text,
        file: file || null,
      };

      console.log("Sending message:", messageData);

      insertChat(messageData);
      setText(""); // Reset text after sending
      setFile(null); // Reset file after sending
    }
  }
  console.log(messages);
  return (
    <>
      <MessageArea>
        {messages.map((msg, idx) => (
          <MessageItem key={idx}>
            <Username uid={msg.user_id} />
            <MessageContent>{msg.content}</MessageContent>
            {msg.file &&
              (msg.file.match(/\.(jpeg|jpg|gif|png)$/i) ? (
                <StyledImage
                  src={msg.file}
                  alt="Attachment"
                />
              ) : (
                <a href={msg.file} target="_blank" rel="noopener noreferrer">
                  View Attachment
                </a>
              ))}
          </MessageItem>
        ))}
      </MessageArea>
      <MessageInputContainer>
        <MessageInput
          placeholder="Type your message..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
        />
        <FileAttachment
          handleFileChange={(e) => setFile(e.target.files[0])}
          file={file}
        />
        <SendButton onClick={handleSendMessage}>Send</SendButton>
      </MessageInputContainer>
    </>
  );
}
