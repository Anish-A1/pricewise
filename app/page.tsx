"use client";

import React, { useState, useEffect } from "react";
import HeroCarousel from "@/components/HeroCarousel";
import Searchbar from "@/components/Searchbar";
import ProductDetails from "@/components/ProductDetails";
import Features from "@/components/Features";
import Modal from "@/components/Modal";
import NotificationBanner from "@/components/NotificationBanner";
import TrendingSection from "@/components/TrendingSection";
import Prediction from "@/components/Prediction";
import Image from "next/image";
import { fetchProducts } from "@/lib/fetchProducts";

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

  const [loading, setLoading] = useState(false);
  const [productLoaded, setProductLoaded] = useState(false);
  const [predictionDone, setPredictionDone] = useState(false);
  const [loadingImageIndex, setLoadingImageIndex] = useState(1);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const productsData = await fetchProducts();
        setProducts(productsData);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    fetchData();
  }, []);

  const showNotification = (message: string, type: "success" | "error") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleSearch = async (url: string) => {
    setLoading(true);
    setProductLoaded(false);
    setPredictionDone(false);

    try {
      const response = await fetch(`/api/products?url=${encodeURIComponent(url)}`);
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

  useEffect(() => {
    if (productUrl) {
      handleSearch(productUrl);
    }
  }, [productUrl]);

  useEffect(() => {
    if (productLoaded) {
      const timer = setTimeout(() => {
        setLoading(false);
      }, 4000);

      return () => clearTimeout(timer);
    }
  }, [productLoaded]);

  useEffect(() => {
    if (productDetails) {
      setProductLoaded(true);
    }
  }, [productDetails]);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (loading) {
      interval = setInterval(() => {
        setLoadingImageIndex((prevIndex) => (prevIndex % 3) + 1);
      }, 5000);
    }

    return () => clearInterval(interval);
  }, [loading]);

  return (
    <>
      <section className="px-6 md:px-10 lg:px-24 py-10 relative">
        {notification && (
          <NotificationBanner
            message={notification.message}
            type={notification.type}
            onClose={() => setNotification(null)}
          />
        )}

        <div className="flex max-xl:flex-col gap-16">
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

            <div className="mt-4">
              <p className="text-gray-800 font-semibold text-lg">
                <span className="animate-pulse text-red-500">
                  💡 Save More, Shop Smarter!
                </span>
              </p>
            </div>

            <div className="mt-8">
              <Searchbar setProductUrl={setProductUrl} />
            </div>
          </div>

          <HeroCarousel />
        </div>

        <Features />
      </section>

      {loading && (
        <div className="flex justify-center items-center py-10">
          <Image
            src={`/assets/images/Search${loadingImageIndex}.png`}
            alt="Loading..."
            width={400}
            height={400}
          />
        </div>
      )}

      {!loading && productDetails && (
        <>
          <ProductDetails
            product={productDetails}
            chartWidth="100%"
            chartHeight="500px"
          />
          <Prediction
            
            priceVariations={
              Array.isArray(productDetails.priceVariations)
                ? productDetails.priceVariations
                : []
            }
          />
        </>
      )}

      <TrendingSection
        products={products}
        setModalProduct={setModalProduct}
        showNotification={showNotification}
      />

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
