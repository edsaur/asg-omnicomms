import { useState } from "react";
import styled from "styled-components";

const StyledFileAttachment = styled.input.attrs({ type: "file" })`
  padding: 5px;
  border: 1px solid #ccc;
  border-radius: 4px;
  cursor: pointer;
`;

export default function FileAttachment({handleFileChange, file}) {

  return (
    <>
      <StyledFileAttachment onChange={handleFileChange} />
      {file && <p>Selected file: {file.name}</p>}
    </>
  );
}
