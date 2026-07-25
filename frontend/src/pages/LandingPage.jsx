import Hero from "../components/Hero/Hero";
import BundleSection from "../components/BundleSection/BundleSection";
import DemoVideos from "../components/DemoVideos/DemoVideos";
import DailyProof from "../components/DailyProof/DailyProof";
import MonetizationProof from "../components/MonetizationProof/MonetizationProof";
import PageGrowth from "../components/PageGrowth/PageGrowth";
import MembersGrowth from "../components/MembersGrowth/MembersGrowth";
import Audience from "../components/Audience/Audience";
import UploadSection from "../components/UploadSection/UploadSection";
import CourseOffer from "../components/CourseOffer/CourseOffer";
import CustomerReviews from "../components/CustomerReviews/CustomerReviews";
import FAQ from "../components/Faq/Faq";
import StickyBuyBar from "../components/StickyBuyBar/StickyBuyBar";

const LandingPage = () => {
  return (
    <>
      <Hero />
      <BundleSection />
      <DemoVideos />
      <DailyProof />
      <MonetizationProof />
      <PageGrowth />
      <MembersGrowth />
      <Audience />
      <UploadSection />
      <CourseOffer />
      <CustomerReviews />
      <FAQ />
      <StickyBuyBar />
    </>
  );
};

export default LandingPage;