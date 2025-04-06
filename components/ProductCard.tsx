import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface Props {
  product: {
    _id: string;
    url: string;
    image: string;
    name: string;
    currentPrice: number;
    lowestPrice: number;
    highestPrice: number;
    rating: number | null;
    website: string;
    priceVariations: { price: number; date: string }[];
  };
  onClick?: () => void; // Optional click handler passed from the parent
  showNotification: (message: string, type: 'success' | 'error') => void; // Notification handler passed from parent
}

const ProductCard = ({ product, onClick, showNotification }: Props) => {
  const [userData, setUserData] = useState<{ email: string; name: string } | null>(null);

  useEffect(() => {
    const fetchUserData = () => {
      const storedUserData = localStorage.getItem('user');
      if (storedUserData) {
        setUserData(JSON.parse(storedUserData));
      } else {
        setUserData(null);
      }
    };

    fetchUserData();
    window.addEventListener('storage', fetchUserData);
    return () => {
      window.removeEventListener('storage', fetchUserData);
    };
  }, []);

  const handleTrackButtonClick = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering the card's click event

    if (!userData) {
      showNotification('Please login to track products.', 'error');
      return;
    }

    try {
      const response = await fetch('/api/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: userData.email,
          username: userData.name,
          productId: product._id,
        }),
      });

      if (response.ok) {
        showNotification('Product tracked successfully!', 'success');
      } else {
        const errorMessage = await response.text();
        showNotification(`Error: ${errorMessage}`, 'error');
      }
    } catch (error) {
      console.error('Error tracking product:', error);
      showNotification('Failed to track the product. Please try again.', 'error');
    }
  };

  const handleBuyNowClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    window.open(product.url, '_blank');
  };

  return (
    <div
      className="flex flex-col gap-4 p-6 w-80 rounded-lg shadow-lg bg-white transition-transform transform hover:-translate-y-1 hover:shadow-2xl h-full cursor-pointer"
      onClick={onClick} // Attach parent `onClick` handler if provided
    >
      {/* Product Link */}
      <div
      className="relative w-full h-64 flex justify-center items-center"
       // Prevent triggering the parent click handler
    >
      <Image
        src={product.image}
        alt={product.name}
        width={450}
        height={300}
        className="object-cover rounded transition-transform hover:scale-105"
      />
    </div>


      {/* Product Details */}
      <h3 className="text-lg font-semibold text-gray-800 truncate">{product.name}</h3>

      <div className="flex justify-between items-center text-sm">
        <p className="bg-yellow-100 text-yellow-600 px-2 py-1 rounded-md font-semibold">Rating: {product.rating}</p>
        <span className="text-blue-500 text-base">{product.website}</span>
        <p className="text-xl font-semibold text-black">₹{product.currentPrice}</p>
      </div>

      {/* Price Range */}
      <div className="flex justify-between text-sm gap-2 -mt-1">
        <p className="bg-green-100 text-green-600 px-2 py-1 rounded-md font-semibold w-full text-center">
          Lowest: ₹{product.lowestPrice}
        </p>
        <p className="bg-red-100 text-red-600 px-2 py-1 rounded-md font-semibold w-full text-center">
          Highest: ₹{product.highestPrice}
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2 -mt-2">
        <button
          className="w-full py-2 px-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-md font-semibold shadow-md transform hover:scale-105 hover:from-blue-600 hover:to-purple-700 transition-all"
          onClick={handleTrackButtonClick}
        >
          Track
        </button>
        <button
          className="w-full py-2 px-4 bg-green-500 text-white rounded-md font-semibold shadow-md transform hover:scale-105 hover:bg-green-400 transition-all"
          onClick={handleBuyNowClick}
        >
          Buy Now
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
