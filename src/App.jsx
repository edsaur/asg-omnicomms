import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Navigate, Route, Routes } from "react-router";
import Call from "./pages/Call";
import Chat from "./pages/Chat";
import Email from "./ui/Email";
import Login from "./pages/Login";
import PageCannotFound from "./pages/PageCannotFound";
import ProtectedRoute from "./pages/ProtectedRoute";
import SMSMessage from "./pages/SMSMessage";
import SendSMS from "./pages/SendSMS";
import Signup from "./pages/Signup";
import AppLayout from "./ui/AppLayout";
import SMS from "./ui/SMS";
import SMSReply from "./pages/SMSReply";
import GetEmails from "./pages/GetEmails";
import EmailSender from "./pages/EmailSender";
import IndividualEmail from "./pages/IndividualEmail";

export default function App() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 0,
      },
    },
  });

  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <Routes>
          <Route
            element={
              <ProtectedRoute>
                <AppLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate replace to="/chat" />} />
            <Route path="/chat" element={<Chat />} />
            <Route path="/email" element={<Email />}>
              <Route path="/email/inbox" element={<GetEmails/>}/>
              <Route path="/email/send" element={<EmailSender/>}/>
              <Route path="/email/:id" element={<IndividualEmail/>}/>
            </Route>
            <Route path="/sms" element={<SMS />}>
              <Route path="/sms/send" element={<SendSMS />} />
              <Route path="/sms/inbox" element={<SMSMessage />} />
              <Route path="/sms/inbox/:sid" element={<SMSReply />} />
            </Route>
            <Route path="/call" element={<Call />} />
          </Route>

          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<PageCannotFound />} />
        </Routes>
      </QueryClientProvider>
    </BrowserRouter>
  );
}
