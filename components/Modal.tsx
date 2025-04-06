import React from "react";
import ProductDetails from "./ProductDetails";

interface ModalProps {
  modalProduct: any | null;
  setModalProduct: (product: any | null) => void;
  modalHeight: string;
  modalWidth: string;
}

const Modal: React.FC<ModalProps> = ({
  modalProduct,
  setModalProduct,
  modalHeight,
  modalWidth,
}) => {
  // Close modal when clicking outside of the modal content
  const handleModalClose = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      setModalProduct(null); // Close modal if background is clicked
    }
  };

  return (
    modalProduct && (
      <div
        className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50 p-0"
        onClick={handleModalClose} // Close modal when clicking outside
      >
        <div
          className="bg-white rounded-lg shadow-lg transform transition-all duration-300 p-0 w-full sm:w-[90%] md:w-[80%] lg:w-[1200px] max-h-[90vh] overflow-hidden"
          style={{
            height: modalHeight,
            maxHeight: "90vh", // Allow modal to be a max height of 90% of the viewport
            borderRadius: "12px", // Slightly rounded corners for a more elegant look
            boxShadow: "0 10px 30px rgba(0, 0, 0, 0.1)", // Soft shadow for premium feel
          }}
        >
          <button
            className="absolute top-5 right-9 text-white bg-red-500 hover:bg-red-700 border-2 border-red-500 rounded-full w-8 h-8 flex items-center justify-center font-bold focus:outline-none focus:ring-2 focus:ring-red-400 shadow-md z-50"
            onClick={() => setModalProduct(null)} // Close modal
          >
            X
          </button>

          {/* Scrollable content area */}
          <div className="flex flex-col h-full">
            {/* Scrollable product details container */}
            <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
              <ProductDetails
                product={modalProduct}
                chartWidth="100%" // Custom chart size for modal
                chartHeight="400px"
                containerWidth="100%" // Passing modal width as containerWidth
                containerHeight="auto" // Passing auto height for flexibility
              />
            </div>
          </div>
        </div>
      </div>
    )
  );
};

export default Modal;
