import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";

const ProductCard = ({ product }) => {
  return (
    <Card className="w-64 overflow-hidden rounded-none border border-gray-300 shadow-sm hover:shadow-md transition-all">
      <CardHeader className="p-0 bg-gray-50 flex items-center justify-center h-56 overflow-hidden">
        <img
          src={product.image[0]}
          alt={product.name}
          className="block object-contain max-w-full max-h-full mx-auto"
        />
      </CardHeader>

      <CardContent className="p-4 space-y-3">
        <CardTitle className="text-base font-semibold line-clamp-1">
          {product.name}
        </CardTitle>

        <p className="text-amber-700 font-bold text-lg">
          {product.price.toLocaleString()}₫
        </p>

        <hr className="border-gray-200" />

        <p className="text-gray-600 text-sm line-clamp-2">
          {product.description || ""}
        </p>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
