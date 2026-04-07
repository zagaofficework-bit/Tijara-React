import { Provider } from "react-redux";
import { store } from "./store";

import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "../pages/Home";
import SignupPage from "../features/auth/pages/SignupPage";
import OtpPage from "../features/auth/pages/Otppage";
import LoginPage from "../features/auth/pages/LoginPage";

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/auth/signup" element={<SignupPage />} />
          <Route path="/auth/otp" element={<OtpPage/>} />
          <Route path="/auth/login" element={<LoginPage />} />
        </Routes>
      </BrowserRouter>
    </Provider>
  );
}

export default App;