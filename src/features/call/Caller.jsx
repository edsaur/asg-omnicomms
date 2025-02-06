import { useState, useEffect } from "react";
import styled from "styled-components";
import { FaPhoneAlt, FaBackspace, FaPhoneSlash } from "react-icons/fa";
import { useOutboundCall } from "./useOutboundCall";

const DialerContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color: #f4f4f4;
  padding: 20px;
`;

const DialerBox = styled.div`
  background: white;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  text-align: center;
  width: 100%;
  max-width: 300px;
`;

const InputField = styled.input`
  width: 100%;
  padding: 10px;
  font-size: 20px;
  text-align: center;
  border: 2px solid #ddd;
  border-radius: 8px;
  margin-bottom: 15px;
  outline: none;
`;

const Keypad = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
`;

const Button = styled.button`
  width: 60px;
  height: 60px;
  font-size: 22px;
  font-weight: bold;
  background: #e0e0e0;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  transition: 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background: #d4d4d4;
  }
`;

const CallButton = styled(Button)`
  background: #28a745;
  color: white;

  &:hover {
    background: #218838;
  }
`;

const BackspaceButton = styled(Button)`
  background: #dc3545;
  color: white;

  &:hover {
    background: #c82333;
  }
`;

const StatusText = styled.p`
  margin-top: 15px;
  font-size: 16px;
  color: #333;
`;

const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ModalContent = styled.div`
  background: white;
  padding: 20px;
  border-radius: 10px;
  text-align: center;
  width: 300px;
  max-width: 100%;
`;

const HangupButton = styled(Button)`
  background: #dc3545;
  color: white;
  margin-top: 20px;

  &:hover {
    background: #c82333;
  }
`;

const AcceptButton = styled(Button)`
  background: #28a745;
  color: white;
  margin-top: 20px;

  &:hover {
    background: #218838;
  }
`;

export default function Caller() {
  const [phoneNumber, setPhoneNumber] = useState("+639563011673");
  const [callStatus, setCallStatus] = useState("Idle");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isIncomingCall, setIsIncomingCall] = useState(false);
  const {
    mutate: outboundCall,
    isPending,
    data,
    error,
  } = useOutboundCall({ setCallStatus, setIsModalOpen });
  const [callsId, setCallsId] = useState("");

  function handleNumberClick(num) {
    setPhoneNumber((prev) => prev + num);
  }

  function handleBackspace() {
    setPhoneNumber((prev) => prev.slice(0, -1));
  }

  function handleCall() {
    if (!phoneNumber) {
      alert("Enter a phone number first!");
      return;
    }

    setCallStatus("Calling...");
    outboundCall({ phoneNumber });
    setIsModalOpen(true); // Show the modal when the call starts
    setCallsId(data.callSid);
  }

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:5000"); // Replace with your server URL

    ws.onopen = () => {
      console.log("Connected to WebSocket server");
    };

    // Update call status based on WebSocket messages
    ws.onmessage = (event) => {
      const { message } = JSON.parse(event.data);
      console.log("Received call status update:", message);

      if (message === "ringing") {
        setCallStatus("Ringing...");
      } else if (message === "answered") {
        setCallStatus("Answered");
      } else if (
        message === "completed" ||
        message === "busy" ||
        message === "failed"
      ) {
        setCallStatus("Idle");
        setIsModalOpen(false); // Close modal when call ends or fails
      } else if (message === "incoming") {
        setIsIncomingCall(true); // Show incoming call modal
      }
    };

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
      setCallStatus("Idle");
      setIsModalOpen(false); // Close modal on WebSocket error
    };

    ws.onclose = () => {
      console.log("Disconnected from WebSocket server");
    };

    // Cleanup WebSocket connection on component unmount
    return () => {
      ws.close();
    };
  }, []);

  // Update call status when mutation completes
  useEffect(() => {
    if (isPending) {
      setCallStatus("Calling...");
    }
  }, [isPending]);

  // Function to handle hang up
  function handleHangup() {
    setIsModalOpen(false); // Close the modal when the call is hung up
    setCallStatus("Idle");
  }

  // Function to handle accepting the call
  function acceptIncomingCall() {
    setIsIncomingCall(false); // Close the incoming call modal
    setCallStatus("Answered");
    console.log("Call accepted.");
    // Trigger your logic to answer the call (e.g., API call to Twilio)
  }

  return (
    <DialerContainer>
      <DialerBox>
        <InputField type="text" value={phoneNumber} readOnly />
        <Keypad>
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, "", 0, "+"].map((num) => (
            <Button key={num} onClick={() => handleNumberClick(num)}>
              {num}
            </Button>
          ))}
        </Keypad>
        <div
          style={{
            marginTop: "15px",
            display: "flex",
            gap: "10px",
            justifyContent: "center",
          }}
        >
          <CallButton onClick={handleCall} disabled={isPending}>
            <FaPhoneAlt />
          </CallButton>
          <BackspaceButton onClick={handleBackspace}>
            <FaBackspace />
          </BackspaceButton>
        </div>
        {callStatus && <StatusText>{callStatus}</StatusText>}
      </DialerBox>

      {isModalOpen && (
        <Modal>
          <ModalContent>
            <h2>Call Status</h2>
            <StatusText>{callStatus}</StatusText>
            <HangupButton onClick={handleHangup}>
              <FaPhoneSlash />
            </HangupButton>
          </ModalContent>
        </Modal>
      )}

      {isIncomingCall && (
        <Modal>
          <ModalContent>
            <h2>Incoming Call!</h2>
            <StatusText>Someone is calling...</StatusText>
            <AcceptButton onClick={acceptIncomingCall}>
              <FaPhoneAlt /> Accept
            </AcceptButton>
            <HangupButton onClick={handleHangup}>
              <FaPhoneSlash /> Reject
            </HangupButton>
          </ModalContent>
        </Modal>
      )}
    </DialerContainer>
  );
}
