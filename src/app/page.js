'use client'
import React, { useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import axios from "axios";

import CheckoutForm from "./components/CheckoutForm";
import CompletePage from "./components/CompletePage";
import Header from "./components/Header";
import Footer from "./components/Footer";

// Make sure to call loadStripe outside of a component's render to avoid
// recreating the Stripe object on every render.
// This is your test publishable API key.
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

export default function App() {
  const [clientSecret, setClientSecret] = useState("");
  const [dpmCheckerLink, setDpmCheckerLink] = useState("");
  const [loading, setLoading] = useState(true);
  const [isCompletionPage, setIsCompletionPage] = useState(false);

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const paymentIntent = searchParams.get("payment_intent");
    const paymentIntentClientSecret = searchParams.get("payment_intent_client_secret");
    const redirectStatus = searchParams.get("redirect_status");

    if (paymentIntent && paymentIntentClientSecret && redirectStatus === "succeeded") {
      setIsCompletionPage(true);
      setClientSecret(paymentIntentClientSecret);
      setLoading(false);
    } else {
      // Create PaymentIntent as soon as the page loads
      axios.post("/api/create-payment-intent", { items: [{ id: "xl-tshirt" }] })
        .then((response) => {
          setClientSecret(response.data.clientSecret);
          setDpmCheckerLink(response.data.dpmCheckerLink);
        })
        .catch((error) => {
          console.error("Error creating PaymentIntent:", error);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, []);

  const appearance = {
    theme: 'stripe',
  };
  const options = {
    clientSecret,
    appearance,
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <Header />
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {loading ? (
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900 mx-auto"></div>
            <p className="mt-4 text-xl font-semibold text-gray-700">Loading...</p>
          </div>
        ) : clientSecret ? (
          <div className="bg-white shadow-lg rounded-lg overflow-hidden max-w-3xl mx-auto">
            <Elements options={options} stripe={stripePromise}>
              {isCompletionPage ? (
                <div className="p-8">
                  <CompletePage />
                </div>
              ) : (
                <div className="p-8">
                  <h2 className="text-2xl font-semibold text-gray-800 mb-6">Complete Your Purchase</h2>
                  <CheckoutForm dpmCheckerLink={dpmCheckerLink} />
                </div>
              )}
            </Elements>
          </div>
        ) : (
          <div className="text-center text-red-600">
            <p>Failed to load payment information. Please try again later.</p>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
