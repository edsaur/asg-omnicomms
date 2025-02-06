export async function sendSMS({ phoneNumber, smsMessage }) {
    try {
      const response = await fetch("http://localhost:5000/send-sms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ to: phoneNumber, message: smsMessage }),
      });
  
      if (!response.ok) {
        throw new Error(`Failed to send SMS: ${response.statusText}`);
      }
  
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error sending SMS:", error);
      alert("Failed to send message. Please try again.");
    }
  }

export async function getSMS() {
    try {
        const response = await fetch("http://localhost:5000/get-sms", {
            method: "GET",
            headers: { "Content-Type": "application/json" },
        });

        if (!response.ok) {
            throw new Error(`Failed to send SMS: ${response.statusText}`);
          }
        const data = await response.json();

        return data.inboundMessage;
    } catch (error) {
        console.error(error);
    }
}

export async function getSingleSMS(sid) {
    try {
        const response = await fetch(`http://localhost:5000/get-single-sms/${sid}`, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
        });

        if (!response.ok) {
            throw new Error(`Failed to send SMS: ${response.statusText}`);
          }
        const data = await response.json();
        return data.message;

    } catch (error) {
        console.error(error);
    }
}
  