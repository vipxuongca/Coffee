import React from "react";

const News = () => {
  const onSubmitHandler = (event) => {
    event.preventDefault();
  };

  return (
    <div className="bg-amber-50 py-16 px-6 sm:px-10  shadow-inner text-center my-12">
      <h2 className="text-3xl font-semibold text-amber-900">
        Đăng ký nhận tin
      </h2>
      <p className="text-gray-600 mt-3 max-w-lg mx-auto text-sm sm:text-base">
        Nhận thông tin mới nhất về sản phẩm, ưu đãi và câu chuyện cà phê từ{" "}
        <span className="font-medium text-amber-800">Velvet Roast</span>.
      </p>

      <form
        onSubmit={onSubmitHandler}
        className="mt-8 flex flex-col sm:flex-row justify-center items-center gap-3 max-w-lg mx-auto"
      >
        <input
          type="email"
          placeholder="Nhập email của bạn..."
          className="w-full sm:flex-1 px-4 py-3 border border-gray-300  focus:outline-none focus:ring-2 focus:ring-amber-600 transition-all duration-200"
          required
        />
        <button
          type="submit"
          className="bg-amber-700 text-white px-6 py-3  hover:bg-amber-800 transition-colors duration-300 w-full sm:w-auto"
        >
          Đăng Ký
        </button>
      </form>

      <p className="text-gray-400 text-xs mt-4">
        Chúng tôi tôn trọng quyền riêng tư và sẽ không gửi thư rác.
      </p>
    </div>
  );
};

export default News;
