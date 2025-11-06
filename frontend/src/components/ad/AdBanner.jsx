import { useState } from "react";

const AdBanner = () => {
  const [visible, setVisible] = useState(true);
  if (!visible) return null;

  return (
    <div className="bg-yellow-300 text-black flex justify-center items-center py-3 px-4 font-semibold animate-pulse">
      <span>ƯU ĐÃI THỬ NGHIỆM: Mua 1 tặng 1 ngay HÔM NAY!!!</span>
      <button
        onClick={() => setVisible(false)}
        className="text-black text-lg leading-none px-2"
      >
        ×
      </button>
    </div>
  );
};

export default AdBanner;
