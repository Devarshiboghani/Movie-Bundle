import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
// import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Hero from "./components/Hero/Hero";
import BundleSection from "./components/BundleSection/BundleSection";
import DemoVideos from "./components/DemoVideos/DemoVideos";
import DailyProof from "./components/DailyProof/DailyProof";
import StickyBuyBar from "./components/StickyBuyBar/StickyBuyBar";
import MonetizationProof from "./components/MonetizationProof/MonetizationProof";
import PageGrowth from "./components/PageGrowth/PageGrowth";
import MembersGrowth from "./components/MembersGrowth/MembersGrowth";
import Audience from "./components/Audience/Audience";
import UploadSection from "./components/UploadSection/UploadSection";
import CourseOffer from "./components/CourseOffer/CourseOffer";
import CustomerReviews from "./components/CustomerReviews/CustomerReviews";
import FAQ from "./components/Faq/Faq";

function App() {
  return (
    <BrowserRouter>
     {/* <Navbar /> */}
     <Hero/>
     <BundleSection />
     <DemoVideos />
     <DailyProof/>
     <MonetizationProof />
     <PageGrowth />
     <MembersGrowth />
     <Audience />
     <UploadSection />
     <CourseOffer />
     <CustomerReviews />
     <FAQ />
     <StickyBuyBar />

      {/* <Routes> */}
        {/* <Route path="/" element={<LandingPage />} /> */}
         {/* <Route path="/" element={<LandingPage />} /> */}
        {/* <Route path="/checkout" element={<Checkout />} />
        <Route path="/download" element={<Download />} /> */}
      {/* </Routes> */}

      {/* <Footer /> */}
    </BrowserRouter>
  );
}

export default App;