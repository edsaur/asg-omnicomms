import styled from "styled-components";
import { useGetSMS } from "./useGetSMS";
import { Link } from "react-router";

const MessageCard = styled.div`
  padding: 15px;
  border-radius: 8px;
  background-color: #f8f9fa;
  border: 1px solid #ddd;
  box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.05);
  margin-bottom: 10px;
  overflow-y: auto;
`;

const Sender = styled.p`
  font-weight: bold;
  color: #333;
  margin-bottom: 5px;
`;

const MessageText = styled.p`
  color: #555;
  font-size: 14px;
`;

export default function SMSInbox() {
  const { smsMessages, isLoading, error } = useGetSMS();

  if (isLoading) return <p>Loading messages...</p>;
  if (error) return <p>Error loading messages: {error.message}</p>;

  return (
    <>
      {smsMessages.length === 0 ? (
        <p>No inbound messages</p>
      ) : (
        smsMessages.map((msg) => (
          <Link to={`/sms/inbox/${msg.sid}`} key={msg.sid}>
            <MessageCard>
              <Sender>From: {msg.from}</Sender>
              <MessageText>{msg.body}</MessageText>
            </MessageCard>
          </Link>
        ))
      )}
    </>
  );
}
