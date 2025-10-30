import React from "react";

const Policy = () => {
  return (
    <div className="max-w-4xl mx-auto p-8 bg-[#f8f3ef] rounded-xl shadow-md text-[#3e2723]">
      <h1 className="text-3xl font-bold mb-6 border-b border-[#a1887f] pb-3">
        Chính Sách Mua Hàng & Giao Nhận
      </h1>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">1. Chính sách giá</h2>
        <p className="leading-relaxed">
          Tất cả sản phẩm cà phê, máy pha và phụ kiện được niêm yết bằng đồng
          Việt Nam (₫), đã bao gồm thuế giá trị gia tăng (VAT). Giá có thể thay
          đổi mà không cần thông báo trước, nhưng các đơn hàng đã xác nhận sẽ
          được giữ nguyên giá tại thời điểm thanh toán.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">2. Chính sách giao hàng</h2>
        <p className="leading-relaxed">
          Chúng tôi giao hàng toàn quốc thông qua các đơn vị vận chuyển uy tín
          như Giao Hàng Nhanh, Viettel Post hoặc J&T Express. Thời gian giao
          hàng dao động từ <strong>1–5 ngày làm việc</strong> tùy khu vực.
        </p>
        <ul className="list-disc pl-6 mt-2 space-y-1">
          <li>Miễn phí giao hàng cho đơn hàng từ 500.000₫ trở lên.</li>
          <li>Đơn hàng dưới 500.000₫: phí vận chuyển 30.000₫.</li>
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">3. Chính sách đổi trả</h2>
        <p className="leading-relaxed">
          Sản phẩm được đổi trả trong vòng <strong>7 ngày</strong> kể từ ngày
          nhận hàng nếu phát hiện lỗi kỹ thuật hoặc hư hỏng do vận chuyển.
        </p>
        <ul className="list-disc pl-6 mt-2 space-y-1">
          <li>Sản phẩm phải còn nguyên tem, hộp, phụ kiện đi kèm.</li>
          <li>Không áp dụng đổi trả với hàng đã qua sử dụng hoặc giảm giá.</li>
          <li>Chi phí vận chuyển đổi trả sẽ được hỗ trợ nếu lỗi từ phía cửa hàng.</li>
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">
          4. Chính sách bảo hành
        </h2>
        <p className="leading-relaxed">
          Các sản phẩm máy pha cà phê chính hãng được bảo hành{" "}
          <strong>12 tháng</strong> theo quy định của nhà sản xuất. Quý khách
          vui lòng giữ hóa đơn mua hàng để được hỗ trợ bảo hành nhanh chóng.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">
          5. Chính sách bảo mật thông tin
        </h2>
        <p className="leading-relaxed">
          Chúng tôi cam kết bảo mật tuyệt đối thông tin cá nhân của khách hàng.
          Dữ liệu chỉ được sử dụng cho mục đích xử lý đơn hàng và chăm sóc sau
          bán hàng, không chia sẻ cho bên thứ ba nếu không có sự đồng ý của
          khách hàng.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-2">6. Liên hệ hỗ trợ</h2>
        <p className="leading-relaxed">
          Mọi thắc mắc vui lòng liên hệ:
        </p>
        <ul className="list-none mt-2 space-y-1">
          <li>📞 Hotline: 0909 123 456</li>
          <li>✉️ Email: support@cafebean.vn</li>
          <li>🏠 Địa chỉ: 25 Nguyễn Trãi, Quận 1, TP. Hồ Chí Minh</li>
        </ul>
      </section>
    </div>
  );
};

export default Policy;
