import React, { useState, useEffect } from "react";
import Image from "next/image";

interface PriceVariation {
  price: number;
  date: string;
}

interface PredictionProps {
  priceVariations: PriceVariation[]; // Accept priceVariations as an array of specific type
}

const Prediction: React.FC<PredictionProps> = ({ priceVariations }) => {
  const [loading, setLoading] = useState(true); // Loading state for the spinner
  const [error, setError] = useState<string | null>(null); // Error state
  const [predictionType, setPredictionType] = useState<"Skip" | "Wait" | "Yes">("Wait"); // Default prediction

  // Fetch prediction from the Python backend
  useEffect(() => {
    fetch("http://localhost:5000/predict", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ priceVariations }), // Sending the price variations to the backend
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.error) {
          setError(data.error);
        } else {
          setPredictionType(data.predictionType); // Get the prediction from backend
        }
      })
      .catch((err) => {
        setError("Error fetching prediction: " + err.message);
      })
      .finally(() => {
        setLoading(false); // Stop the loading state after fetching
      });
  }, [priceVariations]); // Only fetch prediction when priceVariations change

  // Determine the prediction bar properties based on the prediction type
  let barGradient = "";
  let barWidth = "0%";
  let dynamicMessage = "";
  let descriptionColor = "text-gray-600"; // Default color

  if (predictionType === "Skip") {
    barGradient = "bg-red-500"; // Solid red for skip
    barWidth = "5%";
    dynamicMessage = "This is not the right time to buy. Prices are likely to drop soon.";
    descriptionColor = "text-red-500";  
  } else if (predictionType === "Wait") {
    barGradient = "bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500"; // Gradient from red to yellow
    barWidth = "50%";
    dynamicMessage = "Hold on! Prices might stabilize or drop further. Consider waiting.";
    descriptionColor = "text-yellow-500";
  } else if (predictionType === "Yes") {
    barGradient = "bg-gradient-to-r from-red-500 via-orange-500 to-green-500"; // Gradient from red to green
    barWidth = "100%";
    dynamicMessage = "Now is the best time to buy! Prices are unlikely to decrease further.";
    descriptionColor = "text-green-500";
  }

  return (
    <div className="flex justify-center items-center mt-8 px-4 sm:px-6 lg:px-8 w-full">
      <div className="w-full lg:w-3/4 bg-white rounded-lg shadow-md p-6">
        <div className="text-center">
          <h2 className="text-4xl font-semibold text-gray-800 mb-2 inline-block">
            Prediction
          </h2>
          <div className="w-full max-w-[calc(100%_-_52rem)] h-1 bg-red-500 mx-auto mb-4 -mt-2"></div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center mt-8">
            <Image
              src="/assets/images/Predi.png" // Path to your loading PNG image
              alt="Loading..."
              width={100}
              height={100}
            />
          </div>
        ) : error ? (
          <div className="text-center text-red-500 font-semibold mt-6">
            {error}
          </div>
        ) : (
          <>
            <div className="w-3/4 mx-auto h-6 bg-gray-200 rounded-full relative overflow-hidden">
              <div
                className={`absolute top-0 left-0 h-full ${barGradient} rounded-full transition-all duration-700 ease-out`}
                style={{
                  width: barWidth,
                  animation: `expand-bar 1.5s ease-in-out`,
                }}
              ></div>
            </div>

            <div className="w-3/4 mx-auto flex justify-between mt-2 text-lg font-bold relative">
              <span
                className={`text-red-500 ${predictionType === "Skip" ? "animate-bounce" : ""} transition-all`}
              >
                Skip
              </span>
              <span
                className={`text-yellow-500 ${predictionType === "Wait" ? "animate-bounce" : ""} transition-all`}
              >
                Wait
              </span>
              <span
                className={`text-green-500 ${predictionType === "Yes" ? "animate-bounce" : ""} transition-all`}
              >
                Buy
              </span>
            </div>

            <p className={`mt-6 text-center text-lg font-semibold ${descriptionColor}`}>
              {dynamicMessage}
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default Prediction;
