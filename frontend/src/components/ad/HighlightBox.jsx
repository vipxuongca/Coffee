const HighlightBox = () => {
  return (
    <div className="mt-4">
      <style>{`
        @keyframes neon {
          0% { box-shadow: 0 0 8px rgba(255,255,0,0.8), 0 0 18px rgba(255,0,0,0.5); }
          50% { box-shadow: 0 0 18px rgba(255,255,0,1), 0 0 28px rgba(255,0,0,0.7); }
          100% { box-shadow: 0 0 8px rgba(255,255,0,0.8), 0 0 18px rgba(255,0,0,0.5); }
        }
        .flash-marquee { animation: neon 1s ease-in-out infinite; }
        @keyframes slideV {
          0% { transform: translateY(100%); }
          100% { transform: translateY(-100%); }
        }
        .sliding-vertical { 
          animation: slideV 6s linear infinite;
          white-space: nowrap;
        }
      `}</style>

      <div className="relative bg-gradient-to-b from-yellow-400 via-red-400 to-pink-500 rounded-lg p-4 text-black border-4 border-yellow-200 shadow-2xl flash-marquee">
        
        {/* Close button */}
        {/* <button
          type="button"
          className="absolute top-1 right-1 text-xs text-white/90 font-bold"
          onClick={(e) => {
            const container = e.currentTarget.closest(".flash-marquee");
            if (container) container.remove();
          }}
        >
          ✕
        </button> */}

        {/* Centered badge */}
        <div className="flex flex-col items-center">
          <svg className="w-14 h-14 mb-2" viewBox="0 0 100 100" fill="none">
            <circle cx="50" cy="50" r="48" stroke="white" strokeWidth="4" fill="rgba(255,255,255,0.06)" />
            <text x="50%" y="54%" dominantBaseline="middle" textAnchor="middle" fontSize="26" fill="white" fontWeight="700">HOT</text>
          </svg>

          <div className="text-sm font-bold uppercase text-white mb-2">Ưu đãi đặc biệt</div>

          <div className="text-xs sm:text-sm text-white font-extrabold flex flex-col gap-1 text-center">
            <span className="px-2 py-1 rounded bg-black/30">Giảm 30%</span>
            <span className="px-2 py-1 rounded bg-black/30">Mua 1 Tặng 1</span>
          </div>

          {/* Vertical scrolling text */}
          <div className="overflow-hidden h-6 mt-3 text-xs text-white/90 text-center w-full">
            <div className="sliding-vertical">
              ⚡️ Ưu đãi hôm nay • Hết hàng sẽ tắt • Miễn phí giao hàng trên 500k •
            </div>
          </div>

          {/* Button */}
          <button
            className="mt-4 px-4 py-2 rounded-md bg-black text-yellow-300 font-bold hover:scale-105 transition"
            onClick={() => alert("Redirect to promo or purchase flow.")}
          >
            CLAIM
          </button>
        </div>
      </div>
    </div>
  );
};

export default HighlightBox;
