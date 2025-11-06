import React from "react";

const methods = [
  { value: "COD", label: "Thanh toán khi nhận hàng (COD)" },
  { value: "CARD", label: "Thẻ tín dụng / ghi nợ" },
  { value: "TRANSFER", label: "Chuyển khoản ngân hàng" },
  { value: "PAYMENT_GATEWAY", label: "Cổng Thanh Toán" },
];

const PaymentMethod = ({ paymentMethod, setPaymentMethod }) => {
  return (
    <div className="max-w-3xl mx-auto p-8 bg-[#f8f3ef] rounded-xl border mt-10">
      <label className="block text-[#4e342e] font-semibold mb-4">
        Phương thức thanh toán
      </label>

      <div className="flex flex-wrap gap-3 mb-6">
        {methods.map((m) => (
          <button
            key={m.value}
            onClick={() => setPaymentMethod(m.value)}
            className={`px-4 py-2 text-sm rounded-lg border transition ${
              paymentMethod === m.value
                ? "bg-[#4e342e] text-white border-[#4e342e]"
                : "bg-white text-[#4e342e] border-[#a1887f]"
            }`}
          >
            {m.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="p-4 border rounded-lg bg-white text-[#4e342e]">
        {paymentMethod === "COD" && (
          <p>Thanh toán khi nhận hàng. </p>
        )}

        {paymentMethod === "CARD" && (
          <div className="space-y-3">
            <input className="border p-2 w-full rounded" placeholder="Số thẻ" />
            <input className="border p-2 w-full rounded" placeholder="Tên chủ thẻ" />
            <input className="border p-2 w-full rounded" placeholder="MM/YY" />
            <input className="border p-2 w-full rounded" placeholder="CVV" />
          </div>
        )}

        {paymentMethod === "TRANSFER" && (
          <p>
            Chuyển khoản ngân hàng. Hiện hướng dẫn / QR / Số tài khoản tại đây.
          </p>
        )}

        {paymentMethod === "PAYMENT_GATEWAY" && (
          <p>Tích hợp VNPay / MoMo / ZaloPay tại đây.</p>
        )}
      </div>
    </div>
  );
};

export default PaymentMethod;
