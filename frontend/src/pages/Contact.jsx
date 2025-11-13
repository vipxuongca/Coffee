import React, { useState } from "react";
import emailjs from "emailjs-com";

const Contact = () => {
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    emailjs
      .send(
        "YOUR_SERVICE_ID",
        "YOUR_TEMPLATE_ID",
        {
          from_name: form.name,
          from_email: form.email,
          message: form.message,
        },
        "YOUR_PUBLIC_KEY"
      )
      .then(
        () => {
          alert(
            "Cảm ơn bạn đã liên hệ! Chúng tôi sẽ phản hồi sớm nhất có thể."
          );
          setForm({ name: "", email: "", message: "" });
        },
        (error) => {
          alert("Gửi thất bại. Vui lòng thử lại sau.");
          console.error(error);
        }
      );
  };

  return (
    <div className="max-w-3xl mx-auto p-8 text-gray-800">
      <h1 className="text-3xl font-semibold mb-6 text-center text-brown-700">
        Liên hệ với <span className="text-yellow-700">Velvet Roast</span>
      </h1>
      <p className="mb-6 text-center text-gray-600">
        Chúng tôi luôn sẵn lòng lắng nghe mọi ý kiến, phản hồi và câu hỏi từ
        bạn. Hãy gửi tin nhắn cho Velvet Roast thông qua biểu mẫu bên dưới.
      </p>

      <div className="bg-white shadow  p-6 space-y-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Họ và tên
            </label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              className="w-full border border-gray-300  p-2 focus:outline-none focus:ring focus:ring-yellow-600"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full border border-gray-300  p-2 focus:outline-none focus:ring focus:ring-yellow-600"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Tin nhắn
            </label>
            <textarea
              name="message"
              value={form.message}
              onChange={handleChange}
              required
              rows="5"
              className="w-full border border-gray-300  p-2 focus:outline-none focus:ring focus:ring-yellow-600"
              placeholder="Nhập nội dung bạn muốn gửi đến Velvet Roast..."
            ></textarea>
          </div>

          <button
            type="submit"
            className="w-full bg-yellow-700 text-white py-2 px-4  hover:bg-yellow-800 transition"
          >
            Gửi tin nhắn
          </button>
        </form>

        <div className="border-t pt-6 text-sm text-gray-700 space-y-2">
          <p>
            <strong>Địa chỉ:</strong> 48 Trần Hưng Đạo - Hoàn Kiếm - Hà Nội
          </p>
          <p>
            <strong>Email:</strong>{" "}
            <a
              href="mailto:contact@velvetroast.vn"
              className="text-blue-600 hover:underline"
            >
              contact@velvetroast.vn
            </a>
          </p>
          <p>
            <strong>Điện thoại:</strong>{" "}
            <a
              href="tel:+842812345678"
              className="text-blue-600 hover:underline"
            >
              +84 28 1234 5678
            </a>
          </p>
        </div>
      </div>

      <p className="text-center text-gray-500 mt-8">
        Cảm ơn bạn đã tin tưởng và đồng hành cùng Velvet Roast.
      </p>
    </div>
  );
};

export default Contact;
