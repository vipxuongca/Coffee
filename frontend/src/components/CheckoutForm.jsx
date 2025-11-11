import {
  useStripe,
  useElements,
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement
} from "@stripe/react-stripe-js";
import { useState } from "react";

export default function CheckoutForm() {
  const stripe = useStripe();
  const elements = useElements();
  const [cardholderName, setCardholderName] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    const cardNumber = elements.getElement(CardNumberElement);

    const { error } = await stripe.confirmCardPayment(
      "<client_secret_here>",
      {
        payment_method: {
          card: cardNumber,
          billing_details: {
            name: cardholderName
          }
        }
      }
    );

    if (error) {
      console.log(error.message);
    } else {
      console.log("Payment successful");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-sm">
      <label className="block">
        <span>Tên chủ thẻ</span>
        <input
          type="text"
          value={cardholderName}
          onChange={(e) => setCardholderName(e.target.value)}
          className="p-2 border rounded w-full"
          placeholder ="Gustavo Fring"
          required
        />
      </label>

      <label className="block">
        <span>Số thẻ</span>
        <CardNumberElement className="p-2 border rounded w-full" />
      </label>

      <label className="block">
        <span>Hết hạn</span>
        <CardExpiryElement className="p-2 border rounded w-full" />
      </label>

      <label className="block">
        <span>CVC</span>
        <CardCvcElement className="p-2 border rounded w-full" />
      </label>

      <button
        type="submit"
        disabled={!stripe}
        className="w-full bg-blue-600 text-white py-2 rounded"
      >
        Pay
      </button>
    </form>
  );
}
