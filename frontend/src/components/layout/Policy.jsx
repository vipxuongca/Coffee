import React from "react";
import { assets } from "../../assets/assets";

const Policy = () => {
  const policies = [
    {
      icon: assets.exchange_icon,
      title: "Chính Sách Đổi Trả",
      desc: "Đổi trả dễ dàng trong 7 ngày",
    },
    {
      icon: assets.quality_icon,
      title: "Chất Lượng Đảm Bảo",
      desc: "Cam kết sản phẩm chính hãng",
    },
    {
      icon: assets.support_img,
      title: "Hỗ Trợ 24/7",
      desc: "Đội ngũ tận tâm và chuyên nghiệp",
    },
    {
      icon: assets.delivery_icon || assets.exchange_icon, // fallback
      title: "Giao Hàng Nhanh Chóng",
      desc: "Miễn phí vận chuyển đơn trên 500k",
    },
  ];

  return (
    <div className="bg-amber-50 py-16 px-6 sm:px-10  shadow-inner my-10">
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-10 text-center text-gray-700">
        {policies.map((policy, index) => (
          <div
            key={index}
            className="flex flex-col items-center bg-white   shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 p-6"
          >
            <img
              src={policy.icon}
              className="w-14 h-14 mb-4 object-contain"
              alt={policy.title}
            />
            <p className="font-semibold text-amber-800 mb-1">
              {policy.title}
            </p>
            <p className="text-gray-500 text-sm">{policy.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Policy;
