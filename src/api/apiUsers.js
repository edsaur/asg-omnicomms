import { supabase } from "./supabase";
export async function signUpUser({ email, password, username }) {
  console.log(email, password, "here in the api");

  // validating if username is taken
  const { data: existingUser, error: existingError } = await supabase
    .from("profiles")
    .select("username, email")
    .or(`username.eq.${username},email.eq.${email}`)
    .single();

  console.log(existingUser);
  console.log(existingError?.message);
  if (existingError && existingError.code !== "PGRST116")
    throw new Error(existingError?.message);

  if (existingUser)
    throw new Error(
      "Username or email is already taken. Please choose another one"
    );

  // inserting data to user and profile table
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        username,
      },
    },
  });

  if (error) throw new Error(error.message);

  const { error: profileError } = await supabase
    .from("profiles")
    .insert([{ id: data.user.id, username, email }]);

  console.log(profileError.message);
  if (profileError) {
    throw new Error("User created but failed to store profile data.");
  }

  return data;
}
// login users

export async function loginUser({ username, password }) {
  // Step 1: Get the user's email from the profiles table
  const { data: userProfile, error: profileError } = await supabase
    .from("profiles")
    .select("email") // Select only email
    .eq("username", username) // Match username
    .single(); // Ensure we only get one result

  console.log(userProfile);

  // Step 2: Handle errors or if user not found
  if (profileError) {
    throw new Error("Username not found.");
  }

  // Step 3: Use the retrieved email to log in
  const { data, error } = await supabase.auth.signInWithPassword({
    email: userProfile.email,
    password,
  });

  if (error) {
    throw new Error(error.message);
  }

  return data; // Return the user session data
}

// get logged-in users
export async function getUser() {
  const { data: session } = await supabase.auth.getSession();
  if (!session.session) return null;

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error) {
    throw new Error(error.message);
  }
  return user;
}

// signout
export async function logout() {
  const { error } = await supabase.auth.signOut();
  if (error) {
    throw new Error(error.message);
  }
}

// get username
export async function getUsername(uid){
  const {data, error} = await supabase.from('profiles').select('username').eq('id', uid).single();
  if (error) throw new Error(error.message);

  return data;
}
