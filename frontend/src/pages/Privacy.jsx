import React from "react";

const Privacy = () => {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12 bg-[#f8f3ef] text-gray-800">
      <h1 className="text-3xl font-bold mb-6 text-center">Quyền Riêng Tư & Chính Sách Bảo Mật</h1>

      <p className="mb-6">
        Velvet Roast cam kết bảo vệ quyền riêng tư và thông tin cá nhân của khách hàng. 
        Chính sách này giải thích cách chúng tôi thu thập, sử dụng và bảo vệ thông tin khi 
        bạn truy cập hoặc mua sắm trên website của chúng tôi.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-3">1. Thu thập thông tin cá nhân</h2>
      <p className="mb-4">
        Chúng tôi có thể thu thập các thông tin cá nhân như: họ tên, địa chỉ email, số điện thoại, 
        địa chỉ giao hàng và thông tin thanh toán khi bạn đăng ký tài khoản, đặt hàng hoặc liên hệ với chúng tôi.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-3">2. Mục đích sử dụng thông tin</h2>
      <ul className="list-disc list-inside space-y-2 mb-4">
        <li>Xử lý và giao đơn hàng của bạn.</li>
        <li>Liên hệ khi cần xác minh hoặc hỗ trợ giao dịch.</li>
        <li>Gửi thông tin khuyến mãi, ưu đãi nếu bạn đồng ý nhận.</li>
        <li>Cải thiện chất lượng sản phẩm và dịch vụ.</li>
      </ul>

      <h2 className="text-xl font-semibold mt-8 mb-3">3. Bảo mật thông tin</h2>
      <p className="mb-4">
        Chúng tôi áp dụng các biện pháp bảo mật hợp lý để bảo vệ thông tin cá nhân khỏi truy cập trái phép, 
        tiết lộ hoặc thay đổi. Thông tin thanh toán được mã hóa và xử lý qua cổng thanh toán an toàn.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-3">4. Chia sẻ thông tin với bên thứ ba</h2>
      <p className="mb-4">
        Chúng tôi không bán hoặc trao đổi thông tin cá nhân của khách hàng cho bên thứ ba. 
        Thông tin chỉ được chia sẻ với các đối tác liên quan đến quá trình giao hàng hoặc thanh toán, 
        và họ đều cam kết bảo mật thông tin.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-3">5. Quyền của khách hàng</h2>
      <p className="mb-4">
        Bạn có quyền xem, chỉnh sửa hoặc yêu cầu xóa thông tin cá nhân của mình bất kỳ lúc nào bằng 
        cách liên hệ với bộ phận chăm sóc khách hàng của chúng tôi.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-3">6. Thay đổi chính sách</h2>
      <p className="mb-4">
        Velvet Roast có thể cập nhật Chính sách Bảo mật này theo thời gian. 
        Mọi thay đổi sẽ được công bố trên trang web và có hiệu lực ngay khi được đăng tải.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-3">7. Liên hệ</h2>
      <p>
        Nếu bạn có bất kỳ câu hỏi nào liên quan đến chính sách bảo mật, vui lòng liên hệ với chúng tôi qua email:{" "}
        <span className="font-medium text-amber-700">support@velvetroast.vn</span>.
      </p>
    </div>
  );
};

export default Privacy;
