import React, { useState, useEffect } from "react";
import { useStripe } from "@stripe/react-stripe-js";

const StatusIcon = ({ status }) => {
  const iconProps = {
    className: "w-16 h-16",
    fill: "currentColor",
    viewBox: "0 0 20 20",
  };

  switch (status) {
    case "succeeded":
      return (
        <svg {...iconProps} className="text-green-500">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
        </svg>
      );
    case "processing":
      return (
        <svg {...iconProps} className="text-blue-500">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
        </svg>
      );
    default:
      return (
        <svg {...iconProps} className="text-red-500">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
        </svg>
      );
  }
};

const STATUS_CONTENT_MAP = {
  succeeded: {
    title: "Payment Successful",
    description: "Thank you for your purchase. Your payment has been processed successfully.",
  },
  processing: {
    title: "Payment Processing",
    description: "Your payment is currently being processed. We'll update you once it's complete.",
  },
  requires_payment_method: {
    title: "Payment Failed",
    description: "Your payment was not successful. Please try again or use a different payment method.",
  },
  default: {
    title: "Payment Status Unknown",
    description: "We couldn't determine the status of your payment. Please contact support for assistance.",
  }
};

export default function CompletePage() {
  const stripe = useStripe();
  const [status, setStatus] = useState("default");
  const [intentId, setIntentId] = useState(null);

  useEffect(() => {
    if (!stripe) return;

    const clientSecret = new URLSearchParams(window.location.search).get(
      "payment_intent_client_secret"
    );

    if (!clientSecret) return;

    stripe.retrievePaymentIntent(clientSecret).then(({ paymentIntent }) => {
      if (!paymentIntent) return;
      setStatus(paymentIntent.status);
      setIntentId(paymentIntent.id);
    });
  }, [stripe]);

  const { title, description } = STATUS_CONTENT_MAP[status] || STATUS_CONTENT_MAP.default;

  return (
    <div className="max-w-lg mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="flex flex-col items-center mb-6">
        <StatusIcon status={status} />
        <h2 className="mt-4 text-2xl font-bold text-center">{title}</h2>
        <p className="mt-2 text-center text-gray-600">{description}</p>
      </div>
      {intentId && (
        <div className="bg-gray-100 p-4 rounded-md mb-6">
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="text-gray-600">Payment ID:</div>
            <div className="font-mono">{intentId}</div>
            <div className="text-gray-600">Status:</div>
            <div className="font-semibold capitalize">{status.replace('_', ' ')}</div>
          </div>
        </div>
      )}
      <div className="space-y-4">
        {intentId && (
          <a
            href={`https://dashboard.stripe.com/payments/${intentId}`}
            className="block w-full text-center bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            target="_blank"
            rel="noopener noreferrer"
          >
            View payment details
          </a>
        )}
        <a
          href="/"
          className="block w-full text-center border border-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-100 transition duration-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
        >
          Make another payment
        </a>
      </div>
    </div>
  );
}
