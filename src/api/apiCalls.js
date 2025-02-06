export async function outboundCalls({ phoneNumber }) {
    try {
      const response = await fetch("https://4704-180-190-251-150.ngrok-free.app/outgoing-call", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ to: phoneNumber }),
      });
  
      const data = await response.json();
  
      if (data.success) {
        return data;
      } else {
        throw new Error("Call failed");
      }
    } catch (error) {
      throw new Error("Error making call");
    }
  }
