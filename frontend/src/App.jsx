import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

function App() {
  return (
    <BrowserRouter>
     <Navbar />

      <Routes>
        {/* <Route path="/" element={<LandingPage />} /> */}
         <Route path="/" element={<LandingPage />} />
        {/* <Route path="/checkout" element={<Checkout />} />
        <Route path="/download" element={<Download />} /> */}
      </Routes>

      <Footer />
    </BrowserRouter>
  );
}

export default App;