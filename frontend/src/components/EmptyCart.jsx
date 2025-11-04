import { Link } from "react-router-dom";
import { ShoppingCart } from "lucide-react";

const EmptyCart = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center text-[#3e2723]">
      <ShoppingCart size={80} className="text-[#bcaaa4] mb-6" />
      <h2 className="text-2xl font-semibold mb-2">Giỏ hàng của bạn trống</h2>
      <p className="text-[#6d4c41] mb-6">
        Có vẻ như bạn chưa thêm sản phẩm nào vào giỏ hàng.
      </p>
      <Link
        to="/shop"
        className="px-6 py-3 rounded-xl bg-[#3e2723] text-white hover:bg-[#5d4037] transition-all"
      >
        Tiếp tục mua sắm
      </Link>
    </div>
  );
};

export default EmptyCart;
