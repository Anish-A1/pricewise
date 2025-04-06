// src/components/TrendingSection.tsx
import React from "react";
import ProductCard from "@/components/ProductCard";
import Image from "next/image";

interface TrendingSectionProps {
  products: any[];
  setModalProduct: (product: any) => void;
  showNotification: (message: string, type: "success" | "error") => void;
}

const TrendingSection: React.FC<TrendingSectionProps> = ({
  products,
  setModalProduct,
  showNotification,
}) => {
  return (
    <section className="trending-section py-8">
      <h2 className="text-left mb-8 text-5xl font-bold text-gray-800 relative inline-block">
        Trending
        <span
          className="mt-2 absolute bottom-0 left-0 h-1 bg-red-500 rounded-full"
          style={{ top: "60px", width: "100%" }}
        ></span>
      </h2>

      {/* Display Loading Image if Products are Not Loaded */}
      {products.length === 0 ? (
        <div className="flex justify-center items-center">
          <Image
            src="/assets/images/Trending.png"
            alt="Loading Trending Products..."
            width={400}
            height={400}
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 px-4 lg:px-0">
          {products.map((product) => (
            <ProductCard
              key={product._id}
              product={product}
              onClick={() => setModalProduct(product)} // Open modal on card click
              showNotification={showNotification} // Pass the notification handler
            />
          ))}
        </div>
      )}
    </section>
  );
};

export default TrendingSection;
