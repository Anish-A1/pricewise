"use client";
import { useEffect, useState } from "react";
import TrackCard from "../../components/TrackCard";

interface PriceVariation {
  price: number;
  date: string;
}

interface Product {
  productId: {
    _id: string;
    id: string;
    name: string;
    image: string;
    currentPrice: number;
    lowestPrice: number;
    highestPrice: number;
    rating: number;
    website: string;
    desc: string;
    url: string;
    priceVariations: PriceVariation[];
  };
}

const TrackedProducts = () => {
  const [trackedProducts, setTrackedProducts] = useState<Product[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchTrackedProducts = async () => {
      try {
        const user = localStorage.getItem("user");
        if (!user) {
          setError("Please log in to view tracked products");
          setLoading(false);
          return;
        }

        const { token } = JSON.parse(user);

        if (!token) {
          setError("No valid token found");
          setLoading(false);
          return;
        }

        const response = await fetch("/api/getTrackedProducts", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.status === 401) {
          localStorage.removeItem("user");
          setError("Session expired. Please log in again.");
          setLoading(false);
          return;
        }

        if (!response.ok) {
          throw new Error("Failed to fetch tracked products");
        }

        const data = await response.json();

        if (data.trackedProducts && data.trackedProducts.length > 0) {
          setTrackedProducts(data.trackedProducts);
          setError(null); // Clear any existing errors
        } else {
          setTrackedProducts([]);
          setError("No products are being tracked.");
        }
      } catch (err: any) {
        setError(err.message || "An unexpected error occurred");
      } finally {
        // Add a small delay before hiding the loader
        setTimeout(() => {
          setLoading(false);
        }, 500); // Delayed stop for smoother transition
      }
    };

    fetchTrackedProducts();
  }, []);

  return (
    <div className="min-h-screen flex flex-col justify-start">
      {/* Tracked Products heading and line always visible */}
      <div className="tracked-products-container p-6 flex-grow">
        <h1 className="ml-4 text-5xl font-bold text-gray-800 mb-7 relative tracking-wide text-center">
          Tracked Products
          <span
            className="-mt-3 absolute bottom-0 left-1/2 transform -translate-x-1/2 h-1 bg-red-500 rounded-full"
            style={{ top: "60px", width: "60%" }}
          ></span>
        </h1>

        {/* Loading animation */}
        {loading ? (
          <div className="flex items-center justify-center">
            <img
              src="/assets/images/Loading.png"
              alt="Loading"
              className="w-110 h-110"
              style={{ animation: "none" }} // Stops any loading simulation by removing animation
            />
          </div>
        ) : (
          <>
            {/* Error messages */}
            {error && (
              <div>
                {error === "No products are being tracked." ? (
                  // Blue error box for "No products are being tracked"
                  <div
                    className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded relative mb-6"
                    role="alert"
                  >
                    <span className="block sm:inline font-semibold">
                      {error}
                    </span>
                  </div>
                ) : (
                  // Red error box for all other errors
                  <div
                    className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6"
                    role="alert"
                  >
                    <span className="block sm:inline font-semibold">
                      {error}
                    </span>
                  </div>
                )}
              </div>
            )}

            {/* Tracked products */}
            <div className="product-list flex flex-col gap-6">
              {trackedProducts.length > 0 ? (
                trackedProducts.map((product: Product) => {
                  const productId =
                    product.productId._id || product.productId.id;
                  const {
                    name,
                    image,
                    currentPrice,
                    lowestPrice,
                    highestPrice,
                    rating,
                    website,
                    desc,
                    url,
                    priceVariations,
                  } = product.productId;

                  return (
                    <TrackCard
                      key={productId} // productId passed as key
                      productId={productId} // Passing productId as prop
                      name={name}
                      image={image}
                      currentPrice={currentPrice}
                      lowestPrice={lowestPrice}
                      highestPrice={highestPrice}
                      rating={rating}
                      website={website}
                      desc={desc}
                      url={url}
                      priceVariations={priceVariations || []}
                    />
                  );
                })
              ) : null}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default TrackedProducts;
