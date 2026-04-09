import { Provider } from "react-redux";
import { store } from "./Store";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "../home/pages/Home";
import SignupPage from "../features/auth/pages/SignupPage"
import OtpPage from "../features/auth/pages/Otppage";
import LoginPage from "../features/auth/pages/LoginPage";
import ItemsPage from "../features/items/pages/ItemsFilterPage"
import Navbar from "../components/shared/Navbar";
import ItemsSubCategory from "../features/items/pages/ItemsSubCategory";

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
      <Navbar />
      {/* Login Signup */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/auth/signup" element={<SignupPage />} />
          <Route path="/auth/otp" element={<OtpPage/>} />
          <Route path="/auth/login" element={<LoginPage />} />
        </Routes>
        
      {/* Get Item */}
      <Routes>
        <Route path="/get-item" element={<ItemsPage/>}/>
        <Route path="/category/:slug" element={<ItemsSubCategory />} />
      </Routes>

      </BrowserRouter>
    </Provider>
  );
}

export default App;