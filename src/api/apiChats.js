// insert message with attachment

import { supabase, supabaseURL } from "./supabase";

export async function insertChat({ text, file }) {
  const { data: user, error: userError } = await supabase.auth.getUser();
  if (userError) throw new Error(userError.message);

  let fileUrl = null; // Default to null if no file is uploaded

  // Upload file to Supabase Storage if file exists
  if (file) {
    const fileName = `/${Date.now()}-${file.name}`;

    const {error: uploadError} = await supabase.storage.from('chat-attachments').upload(fileName, file, {
      cacheControl: '3600',
      upsert: false
    });

    if(uploadError){
      console.error(uploadError.message);
      throw new Error(uploadError.message);
    }
    fileUrl = `${supabase.storage.from('chat-attachments').getPublicUrl(fileName).data.publicUrl}`;
  }

  // Insert message (with text & file URL) into the messages table
  const { data, error } = await supabase
    .from("messages")
    .insert([{ user_id: user.user.id, content: text, file: fileUrl }])
    .select()
    .single();

  if (error) throw new Error(`Error inserting message: ${error.message}`);

  return data;
}
