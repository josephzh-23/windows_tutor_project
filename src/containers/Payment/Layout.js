// import Head from "next/head";
import styled from "@emotion/styled";
import GlobalStyles from "./prebuilt/GlobalStyles";

import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import CheckoutForm from './CheckoutForm';

// Learning
// To best leverage Stripe’s advanced fraud functionality,
// include this script on every page, not just the checkout page.
// This allows Stripe to detect anomalous behavior that may be indicative
// of fraud as customers browse your website.
// Note: This is why we are adding it to a Layout component.

const stripePromise = loadStripe("pk_test_51JPZJwIvBgnSRqw7iiT5nhzf1YSRVWUslcmBaYtOsLVsoxuXPpiYgCTFvIYPxKx5Da0xIT5u4539kP3N4ERbdT1c00t7yuWSkI");

// TIP
// call loadStripe outside of a component
// in that way there's no chance it will get
// called more times than it needs to

const Layout = ({ children, title }) => {
  return (
   
      <Elements stripe={stripePromise}>

        <CheckoutForm

        // todo: change the price to price as per appointment 
        // price={getDonutPrice(numDonuts)}
        // onSuccessfulCheckout={() => Router.push("/success")}
      />
      </Elements>
    
  );
};

export default Layout;