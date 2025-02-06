import { useParams } from "react-router";
import styled from "styled-components";
import { useFetchIndividualEmail } from "./useFetchIndividualEmail";
import parse from "html-react-parser";
import DOMPurify from "dompurify";

const EmailContainer = styled.div`
  max-width: 700px;
  margin: 20px auto;
  background: #fff;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  padding: 20px;
  border: 1px solid #ddd;
`;

const EmailHeader = styled.div`
  border-bottom: 1px solid #eee;
  padding-bottom: 10px;
  margin-bottom: 15px;
`;

const EmailTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: bold;
  color: #333;
`;

const EmailMeta = styled.p`
  font-size: 0.9rem;
  color: #666;
  margin: 5px 0;
`;

const EmailBody = styled.div`
  font-size: 1rem;
  color: #444;
  line-height: 1.6;
  word-wrap: break-word;
`;

const AttachmentsSection = styled.div`
  margin-top: 20px;
  border-top: 1px solid #eee;
  padding-top: 15px;
`;

const AttachmentLink = styled.a`
  display: block;
  margin: 5px 0;
  font-size: 1rem;
  color: #007bff;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`;

export default function FetchIndividualEmail() {
  const { id } = useParams();
  const { email, isLoading, error } = useFetchIndividualEmail({ id });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>{error.message}</div>;

  const cleanHTML = DOMPurify.sanitize(
    email.html || "No email content available."
  );

  return (
    <EmailContainer>
      <EmailHeader>
        <EmailTitle>{email.subject}</EmailTitle>
        <EmailMeta>
          From: <strong>{email.from}</strong>
        </EmailMeta>
        <EmailMeta>
          To: <strong>{email.to}</strong>
        </EmailMeta>
        <EmailMeta>Date: {new Date(email.date).toLocaleString()}</EmailMeta>
      </EmailHeader>
      <EmailBody>{parse(cleanHTML)}</EmailBody>

      {/* Handle Attachments */}
      {email.attachments && email.attachments.length > 0 && (
        <AttachmentsSection>
          <h3>Attachments</h3>
          {email.attachments.map((attachment, index) => {
            // Handle file preview if it's an image
            if (attachment.contentType.startsWith("image/")) {
              return (
                <div key={index}>
                  <h4>{attachment.filename}</h4>
                  <img
                    src={`data:${attachment.contentType};base64,${attachment.content}`}
                    alt={attachment.filename}
                    style={{ maxWidth: "100%", height: "auto" }}
                  />
                </div>
              );
            }

            // Otherwise, provide a link to download the file
            return (
              <AttachmentLink
                key={index}
                href={`data:${attachment.contentType};base64,${attachment.content}`}
                download={attachment.filename}
              >
                {attachment.filename}
              </AttachmentLink>
            );
          })}
        </AttachmentsSection>
      )}
    </EmailContainer>
  );
}
