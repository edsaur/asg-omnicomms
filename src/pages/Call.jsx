import styled from "styled-components";
import Caller from "../features/call/Caller";
import { useState } from "react";

const CallContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: #f4f4f4;
  padding: 20px;

  .call-box {
    background: white;
    padding: 20px;
    border-radius: 12px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
    width: 100%;
    max-width: 400px;
    text-align: center;
  }

  .call-title {
    font-size: 24px;
    font-weight: bold;
    color: #333;
    margin-bottom: 10px;
  }

  .call-button {
    background: #007bff;
    color: white;
    border: none;
    padding: 10px 20px;
    font-size: 16px;
    border-radius: 8px;
    cursor: pointer;
    transition: 0.3s;
  }

  .call-button:hover {
    background: #0056b3;
  }
`;

export default function Call() {
 
  return (
    <CallContainer>
      <div className="call-box">
        <h2 className="call-title">Start a Call</h2>
        <Caller />
      </div>
    </CallContainer>
  );
}
