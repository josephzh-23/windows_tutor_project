  
import { Elements } from "@stripe/react-stripe-js"
import { loadStripe } from "@stripe/stripe-js"
import React from "react"
import PaymentForm from "./PaymentForm"

const PUBLIC_KEY = "pk_test_51JPZJwIvBgnSRqw7iiT5nhzf1YSRVWUslcmBaYtOsLVsoxuXPpiYgCTFvIYPxKx5Da0xIT5u4539kP3N4ERbdT1c00t7yuWSkI"

const stripeTestPromise = loadStripe(PUBLIC_KEY)



export default function StripeContainer() {
	return (

        // Will load the stripe here 
		<Elements stripe={stripeTestPromise}>
			<PaymentForm />
		</Elements>
	)
}