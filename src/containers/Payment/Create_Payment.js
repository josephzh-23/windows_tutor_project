
import { useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { CheckoutForm } from './CheckoutForm';
import { Elements } from '@stripe/react-stripe-js';


//source https://betterprogramming.pub/stripe-api-tutorial-with-react-and-node-js-1c8f2020a825

const CreatePayment=()=>{

    const PUBLIC_KEY = "pk_test_51JPZJwIvBgnSRqw7iiT5nhzf1YSRVWUslcmBaYtOsLVsoxuXPpiYgCTFvIYPxKx5Da0xIT5u4539kP3N4ERbdT1c00t7yuWSkI";

    const stripeTestPromise = loadStripe(PUBLIC_KEY);

    useEffect(()=>{
    })

    // Create a Stripe client.
		
return (
    <Elements stripe={stripeTestPromise}>
      <CheckoutForm />
    </Elements>



    )}



export default CreatePayment