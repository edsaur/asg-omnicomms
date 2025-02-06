export async function fetchEmails() {
    try {
        const res = await fetch("http://localhost:5000/fetch-emails");
        console.log(res)
        const data = await res.json();
        console.log(data)
        return data;
    } catch (error) {
        console.error(error.message);
    }
}

export async function fetchIndividualEmail(id){
    try {
        const res = await fetch(`http://localhost:5000/email/${id}`);
        const data = await res.json();
        console.log(data);

        return data;
    } catch (error) {
        console.error(error.message);
    }
}

export async function sendEmail({to, subject, message, attachment}) {

    const formData = new FormData();
    formData.append('to', to);
    formData.append('subject', subject);
    formData.append('message', message);
    if(attachment) formData.append('attachment', attachment);

    try {
        const res = await fetch(`http://localhost:5000/send-email`, {
            method: "POST",
            body: formData
        });

        const data = await res.json();

        return data;
        
    } catch (error) {
        console.error(error.message);
    }
}