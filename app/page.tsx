"use client";
import React, { useState, useEffect, useCallback } from "react"; // Add useCallback here
import HeroCarousel from "@/components/HeroCarousel";
import Searchbar from "@/components/Searchbar";
import ProductDetails from "@/components/ProductDetails";
import Features from "@/components/Features";
import Modal from "@/components/Modal";
import NotificationBanner from "@/components/NotificationBanner";
import TrendingSection from "@/components/TrendingSection";
import Prediction from "@/components/Prediction"; // Import the Prediction component
import Image from "next/image";

// Use a server function to fetch data
export async function fetchProducts() {
  const res = await fetch("http://localhost:3000/api/products");
  const products = await res.json();
  return products;
}

const Home = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [productUrl, setProductUrl] = useState<string | null>(null);
  const [productDetails, setProductDetails] = useState<any>(null);
  const [modalProduct, setModalProduct] = useState<any | null>(null);
  const [modalWidth, setModalWidth] = useState<string>("60%");
  const [modalHeight, setModalHeight] = useState<string>("auto");
  const [notification, setNotification] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  const [loading, setLoading] = useState(false); // Loader state
  const [productLoaded, setProductLoaded] = useState(false); // Track product load status
  const [predictionDone, setPredictionDone] = useState(false); // Track prediction status
  const [loadingImageIndex, setLoadingImageIndex] = useState(1); // Index for cycling loader images

  // Fetch products when component mounts
  useEffect(() => {
    const fetchData = async () => {
      const productsData = await fetchProducts();
      setProducts(productsData);
    };
    fetchData();
  }, []);

  // Handle notifications centrally
  const showNotification = (message: string, type: "success" | "error") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000); // Clear notification after 3 seconds
  };

  // Handle the search and fetch product based on the URL
  const handleSearch = async (url: string) => {
    setLoading(true); // Show loader when search is initiated
    setProductLoaded(false); // Reset product load state
    setPredictionDone(false); // Reset prediction state

    try {
      const response = await fetch(
        `/api/products?url=${encodeURIComponent(url)}`
      );
      const data = await response.json();

      if (data.error) {
        setProductDetails(null);
        showNotification(data.error, "error");
      } else if (data) {
        setProductDetails(data);
      } else {
        setProductDetails(null);
        showNotification("Product not found in the database.", "error");
      }
    } catch (error) {
      console.error("Error fetching product details:", error);
      setProductDetails(null);
      showNotification("Failed to fetch product details.", "error");
    }
  };

  // When productUrl changes, call handleSearch to fetch product details
  useEffect(() => {
    if (productUrl) {
      handleSearch(productUrl);
    }
  }, [productUrl]);

  // Check if both product details and prediction are loaded to stop the loader
  useEffect(() => {
    if (productLoaded) {
      // Add a smooth delay before stopping the loader
      const timer = setTimeout(() => {
        setLoading(false);
      }, 4000); // 500ms delay for smooth transition

      return () => clearTimeout(timer); // Cleanup timeout if dependencies change
    }
  }, [productLoaded]);

  // Mark product as loaded once product details are available
  useEffect(() => {
    if (productDetails) {
      setProductLoaded(true); // Mark product as loaded
    }
  }, [productDetails]);

  // Handle cycling through loading images
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (loading) {
      interval = setInterval(() => {
        setLoadingImageIndex((prevIndex) => (prevIndex % 3) + 1); // Cycle through 1, 2, 3
      }, 5000); // Change every 5 seconds
    }

    // Cleanup interval on unmount or when loading state changes
    return () => clearInterval(interval);
  }, [loading]); // Only set the interval when loading is true

  return (
    <>
      <section className="px-6 md:px-10 lg:px-24 py-10 relative">
        {/* Notification Banner */}
        {notification && (
          <NotificationBanner
            message={notification.message}
            type={notification.type}
            onClose={() => setNotification(null)} // Pass the onClose function here
          />
        )}

        <div className="flex max-xl:flex-col gap-16">
          {/* Left Section */}
          <div className="flex flex-col justify-center relative">
            <p className="small-text flex items-center gap-2 text-gray-700 font-semibold">
              <span>Smart Shopping Starts Here:</span>
              <Image
                src="/assets/icons/arrow-right.svg"
                alt="arrow-right"
                width={16}
                height={16}
              />
            </p>

            <h1 className="head-text text-5xl font-extrabold mt-4 leading-tight text-gray-900">
              Unleash the Power of{" "}
              <span className="text-primary ml-1 bg-gradient-to-r from-red-500 to-pink-500 bg-clip-text text-transparent ">
                PriceWise
              </span>
            </h1>

            <p className="mt-6 ml-3 text-lg text-gray-700">
              Powerful, self-serve product and growth analytics to help you
              convert, engage, and retain more. Discover insights and make smarter
              shopping decisions.
            </p>

            {/* Add Dynamic Tagline */}
            <div className="mt-4">
              <p className="text-gray-800 font-semibold text-lg">
                <span className="animate-pulse text-red-500">
                  💡 Save More, Shop Smarter!
                </span>
              </p>
            </div>

            {/* Add Searchbar */}
            <div className="mt-8">
              <Searchbar setProductUrl={setProductUrl} />
            </div>
          </div>

          {/* Right Section - Carousel */}
          <HeroCarousel />
        </div>

        {/* Features Section */}
        <Features />
      </section>

      {/* Loader Component */}
      {loading && (
        <div className="flex justify-center items-center py-10">
          <Image
            src={`/assets/images/Search${loadingImageIndex}.png`} // Cycles through Search1.png, Search2.png, and Search3.png
            alt="Loading..."
            width={400}
            height={400}
          />
        </div>
      )}

      {/* Product Details Section */}
      {!loading && productDetails && (
        <>
          <ProductDetails
            product={productDetails}
            chartWidth="100%" // Custom width for the chart
            chartHeight="500px" // Custom height for the chart
          />
          {/* Prediction Component */}
          <Prediction
            predictionType="Yes"
            priceVariations={Array.isArray(productDetails.priceVariations) ? productDetails.priceVariations : []} // Ensure it's an array
          />
        </>
      )}

      {/* Trending Products */}
      <TrendingSection
        products={products}
        setModalProduct={setModalProduct}
        showNotification={showNotification}
      />

      {/* Render the modal from Modal component */}
      <Modal
        modalProduct={modalProduct}
        setModalProduct={setModalProduct}
        modalHeight="650px"
        modalWidth={modalWidth}
      />
    </>
  );
};

export default Home;
