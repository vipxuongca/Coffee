import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const ProductCard = ({ product }) => {
  return (
    <Card className="w-60 h-[300px] flex flex-col overflow-hidden border border-gray-300 shadow-sm hover:shadow-md transition-all duration-300 rounded-none">
      {/* Image Section */}
      <CardHeader className="p-0 bg-gray-50 flex items-center justify-center h-64 overflow-hidden">
        <img
          src={product.image[0]}
          alt={product.name}
          className="object-contain max-w-full max-h-full mx-auto"
        />
      </CardHeader>

      {/* Content Section */}
      <CardContent className="flex flex-col justify-between p-4 flex-1">
        {/* Title */}
        <CardTitle className="text-xl font-bold text-gray-900 leading-tight line-clamp-2 h-[52px]">
          {product.name}
        </CardTitle>

        {/* Price */}
        <p className="text-amber-700 font-extrabold text-xl h-[32px] leading-none flex items-center tracking-tight">
          {product.price.toLocaleString()}₫
        </p>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
