import React from "react";
import { assets } from "../assets/assets";

const methods = [
  { value: "COD", label: "Thanh toán khi nhận hàng (COD)" },
  { value: "CARD", label: "Thẻ tín dụng / ghi nợ" },
  { value: "TRANSFER", label: "Chuyển khoản ngân hàng" },
  { value: "STRIPE", label: "Stripe" },
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
        {paymentMethod === "COD" && <p>Thanh toán khi nhận hàng. </p>}

        {paymentMethod === "CARD" && (
          <div className="space-y-3">
            <input className="border p-2 w-full rounded" placeholder="Số thẻ" />
            <input
              className="border p-2 w-full rounded"
              placeholder="Tên chủ thẻ"
            />
            <input className="border p-2 w-full rounded" placeholder="MM/YY" />
            <input className="border p-2 w-full rounded" placeholder="CVV" />
          </div>
        )}

        {paymentMethod === "TRANSFER" && (
          <div className="space-y-4 leading-relaxed">
            <p>
              Vui lòng chuyển khoản theo thông tin dưới đây. Sau khi chuyển
              khoản thành công, quý khách giữ lại biên lai/ảnh chụp để đối chiếu
              khi cần thiết.
            </p>

            <div className="border p-4 rounded bg-gray-50 space-y-1">
                          <div className="pt-4 flex flex-col items-center">
              <div className="w-48 h-48 bg-gray-200 flex items-center justify-center">
                <img
                  src={assets.qr}
                  alt="QR"
                  className="w-full h-full object-contain"
                />
              </div>
            </div>
              <p>
                <span className="font-semibold">Ngân hàng:</span> Vietcombank
              </p>
              <p>
                <span className="font-semibold">Chủ tài khoản:</span> Công ty
                TNHH VELVET ROAST
              </p>
              <p>
                <span className="font-semibold">Số tài khoản:</span> 0123 4567
                890
              </p>
              <p>
                <span className="font-semibold">Chi nhánh:</span> Hà Nội
              </p>
            </div>

            <p>
              <span className="font-semibold">Nội dung chuyển khoản:</span>{" "}
              Thanh toán đơn hàng
            </p>



            <p className="text-sm text-gray-600">
              Lưu ý: Đơn hàng sẽ được xác nhận sau khi bộ phận kế toán kiểm tra
              và duyệt thanh toán.
            </p>
          </div>
        )}

        {paymentMethod === "STRIPE" && (
          <p>STRIPE</p>
        )}
      </div>
    </div>
  );
};

export default PaymentMethod;
