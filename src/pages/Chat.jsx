import styled from "styled-components";
import Chatroom from "../features/chats/Chatroom";

// Wrapper for the entire Chat page
const ChatContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: #f7f7f7;
`;

// Styled container for the chat area, giving it some margin and padding
const ChatArea = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 2rem;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  margin: 1rem;
  overflow-y: auto;
`;

// Optional: add some styling for the header, if you want to add a title or anything at the top
const ChatHeader = styled.div`
  padding: 1rem;
  background-color: #0066cc;
  color: white;
  font-size: 1.5rem;
  font-weight: 600;
  text-align: center;
  border-radius: 8px 8px 0 0;
`;

export default function Chat() {
    return (
        <ChatContainer>
            <ChatHeader>Chat</ChatHeader>
            <ChatArea>
                <Chatroom />
            </ChatArea>
        </ChatContainer>
    );
}
