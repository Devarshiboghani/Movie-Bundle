import CheckoutHero from "../components/Checkout/CheckoutHero";
import Description from "../components/Checkout/Description";
import Testimonial from "../components/Checkout/Testimonial";
import CheckoutFaq from "../components/Checkout/CheckoutFaq";
import Contact from "../components/Checkout/Contact";

const CheckoutPage = () => {
  return (
    <>
      <CheckoutHero />
      <Description />
      <Testimonial />
      <CheckoutFaq />
      <Contact />
    </>
  );
};

export default CheckoutPage;