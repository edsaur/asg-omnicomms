import { useState, useEffect } from "react";
import styled from "styled-components";
import { FaPhoneAlt, FaBackspace, FaPhoneSlash } from "react-icons/fa";
import { Device } from "@twilio/voice-sdk";
import axios from "axios"; // Importing axios

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

export default function Caller() {
  const [phoneNumber, setPhoneNumber] = useState("+18312312442");
  const [callStatus, setCallStatus] = useState("Idle");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [twilioDevice, setTwilioDevice] = useState(null);
  console.log(twilioDevice);
  // Fetch Twilio token
  useEffect(() => {
    const fetchTwilioToken = async () => {
      try {
        const res = await axios.get("http://localhost:5000/token");
        const { token } = res.data;

        console.log("Fetched Twilio token:", token);

        const device = new Device(token, {
          logLevel: "error", // Enable debugging logs
        });

        console.log("Twilio Device Created:", device);

        device.on("ready", () => {
          console.log("Twilio Device is READY ✅");
        });

        device.on("error", (error) => {
          console.error("Twilio Device ERROR ❌", error);
        });

        setTwilioDevice(device);
      } catch (error) {
        console.error("Error fetching Twilio token:", error);
      }
    };

    fetchTwilioToken();
  },[]);

  const handleNumberClick = (num) => {
    setPhoneNumber((prev) => prev + num);
  };

  const handleBackspace = () => {
    setPhoneNumber((prev) => prev.slice(0, -1));
  };

  const handleCall = async () => {
    if (!phoneNumber) {
      alert("Enter a phone number first!");
      return;
    }

    setCallStatus("Calling...");
    setIsModalOpen(true); // Show the modal when the call starts

    try {
      // Making the outbound call API request with axios
      const response = await axios.post(
        "https:///4704-180-190-251-150.ngrok-free.app/outgoing-call",
        { to: phoneNumber }
      );

      const data = response?.data; // Response data

      console.log("Response data:", data); // Log the response for debugging

      // Use Twilio SDK to make the call (ensure Twilio device is initialized)
      if (twilioDevice) {
        console.log(twilioDevice);
        
        twilioDevice.connect({
          params: { to: phoneNumber },
        });
      }
    } catch (error) {
      console.error("Error making call:", error);
      setCallStatus("Failed to make call");
      setIsModalOpen(false);
    }
  };

  const handleHangup = () => {
    // Hang up the call
    if (twilioDevice) {
      twilioDevice.disconnectAll();
    }
    setIsModalOpen(false); // Close modal when call ends
    setCallStatus("Idle");
  };

  // WebSocket setup for status updates
  useEffect(() => {
    const ws = new WebSocket("ws://localhost:5000");

    ws.onopen = () => console.log("WebSocket connected");
    ws.onmessage = (event) => {
      const { message } = JSON.parse(event.data);
      if (message === "ringing") setCallStatus("Ringing...");
      else if (message === "answered") setCallStatus("Answered");
      else if (message === "completed" || message === "failed") {
        setCallStatus("Idle");
        setIsModalOpen(false);
      }
    };
    ws.onclose = () => console.log("WebSocket disconnected");

    return () => ws.close();
  }, []);

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
          <CallButton onClick={handleCall}>
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
    </DialerContainer>
  );
}
