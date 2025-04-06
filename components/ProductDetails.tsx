import { useState } from 'react';
import ProdDChart from './ProdDChart';  // Import the ProdDChart component
import { ProductType } from '@/types/types';

interface ProductDetailsProps {
  product: ProductType;
  chartWidth: string;
  chartHeight: string;
  containerWidth?: string;
  containerHeight?: string;
}

const ProductDetails = ({
  product,
  chartWidth = "100%",
  chartHeight = "300px", 
  containerWidth = "100%",
  containerHeight = "auto",
}: ProductDetailsProps) => {
  const [modal, setModal] = useState<{ show: boolean; message: string; type: 'success' | 'error' | '' }>({
    show: false,
    message: '',
    type: '',
  });

  const handleTrackButtonClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const storedUserData = localStorage.getItem('user');
    const userData = storedUserData ? JSON.parse(storedUserData) : null;
    if (!userData || !userData.email || !userData.name) {
      setModal({
        show: true,
        message: 'Please Login To Track',
        type: 'error',
      });
      setTimeout(() => setModal({ show: false, message: '', type: '' }), 4000);
      return;
    }
    try {
      const response = await fetch('/api/track', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: userData.email,
          username: userData.name,
          productId: product._id,
        }),
      });
      const message = await response.text();
      if (response.ok) {
        setModal({
          show: true,
          message: 'Product tracked successfully',
          type: 'success',
        });
        setTimeout(() => setModal({ show: false, message: '', type: '' }), 4000);
      } else {
        alert(`Error: ${message}`);
      }
    } catch (error) {
      console.error('Error tracking product:', error);
      alert('Error tracking product');
    }
  };

  return (
    <div
      className="flex justify-center items-center px-4 sm:px-6 lg:px-8"
      style={{
        width: containerWidth,
        height: containerHeight,
      }}
    >
      <div className="border-2 border-gray-300 rounded-lg w-full lg:w-3/4 p-6 shadow-lg transition-transform hover:-translate-y-1 hover:shadow-2xl bg-white">
        <div className="flex flex-col lg:flex-row items-stretch">
          {/* Left side: Image */}
          <div className="border-2 border-gray-300 rounded-lg flex-shrink-0 w-full lg:w-1/3 flex justify-center items-center mb-4 lg:mb-0">
            <div className="rounded-lg p-4 overflow-hidden">
              <img
                src={product.image || '/placeholder.jpg'}
                alt={product.name}
                className="w-full h-auto object-cover transition-transform duration-200 hover:scale-105"
              />
            </div>
          </div>

          {/* Right side: Product details */}
          <div className="border-2 border-gray-300 p-4 rounded-lg flex flex-col items-center text-center space-y-4 w-full lg:w-2/3 lg:pl-4 h-full">
            {/* Title */}
            <h1 className="text-2xl font-semibold text-gray-800">{product.name}</h1>
            <div className="border-b-4 border-red-500 w-1/2 my-2"></div>

            {/* Description */}
            <p className="text-gray-600 mt-2">{product.desc}</p>

            {/* Website and Rating */}
            <div className="flex justify-center items-center mt-2 space-x-2">
              <p className="bg-blue-100 text-blue-600 px-2 py-1 rounded-md font-semibold">
                Website: Amazon
              </p>
              <span className="bg-yellow-100 text-yellow-600 font-semibold py-1 px-2 rounded-md">
                Rating: {product.rating}
              </span>
            </div>

            {/* Current Price */}
            <div className="text-3xl font-bold text-gray-900 mt-4">
              ₹{product.currentPrice}
            </div>

            {/* Lowest and Highest Prices */}
            <div className="flex gap-2 justify-center">
              <p className="bg-green-100 text-green-600 px-2 py-1 rounded-md font-semibold w-30 text-center">
                Lowest: ₹{product.lowestPrice}
              </p>
              <p className="bg-red-100 text-red-600 px-2 py-1 rounded-md font-semibold w-30 text-center">
                Highest: ₹{product.highestPrice}
              </p>
            </div>

            {/* Buttons */}
            <div className="flex gap-2 justify-center mt-4">
              <button
                onClick={handleTrackButtonClick}
                className="w-28 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-md font-semibold shadow-md transform hover:scale-105 hover:from-blue-600 hover:to-purple-700 transition-all"
              >
                Track
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  window.open(product.url, '_blank');
                }}
                className="w-28 py-2 bg-green-500 text-white rounded-md font-semibold shadow-md transform hover:scale-105 hover:bg-green-400 transition-all"
              >
                Buy Now
              </button>
            </div>

            {/* Modal for success or error */}
            {modal.show && (
              <div className={`mt-2 text-sm text-center font-semibold ${modal.type === 'success' ? 'text-green-500' : 'text-red-500'}`}>
                {modal.type === 'success' ? (
                  <span className="inline-block text-lg text-green-500 mr-2">✓</span>
                ) : (
                  <span className="inline-block text-lg text-red-500 mr-2">✖</span>
                )}
                {modal.message}
              </div>
            )}
          </div>
        </div>

        {/* Chart Section */}
        <div className="mt-6">
          <ProdDChart
            product={product}
            chartWidth="100%"  // Make chart width responsive
            chartHeight="440px"  // Chart height is customizable
          />
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
