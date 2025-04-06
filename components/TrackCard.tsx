import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { jwtDecode, JwtPayload } from 'jwt-decode';

interface PriceVariation {
  price: number;
  date: string;
}

interface Product {
  productId: string;
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
}

const TrackCard = ({
  productId,
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
}: Product) => {
  const [trackPrice, setTrackPrice] = useState<string>(''); 
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string>('');
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  interface DecodedToken {
    userId: string;
  }
  useEffect(() => {
    const storedData = localStorage.getItem('user');
    if (storedData) {
      const { email, token } = JSON.parse(storedData);
      console.log("Token from storage:", token);
      setUserEmail(email);
      if (token) {
        try {
          const decoded = jwtDecode<DecodedToken>(token);
          console.log("Decoded token:", decoded);
          if (decoded && decoded.userId) {
            setUserId(decoded.userId);
          } else {
            console.warn("Decoded token does not contain userId");
          }
        } catch (error) {
          console.error('Error decoding token:', error);
        }
      }
    }
  }, []);
  

  useEffect(() => {
    const fetchTrackPrice = async () => {
      try {
        const response = await fetch('/api/getTPrice', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ userId, productId }), // Ensure productId is passed correctly
        });

        if (!response.ok) {
          const errorMessage = await response.text();
          throw new Error(errorMessage);
        }

        const data = await response.json();

        if (data?.trackPrice) {
          setTrackPrice(data.trackPrice);
          setErrorMessage('');
        } else {
          setErrorMessage('Track price not found.');
        }
      } catch (error: unknown) {
        if (error instanceof Error) {
          setErrorMessage('');
        } else {
          setErrorMessage('');
        } // Clear old data on error
      }
    };

    fetchTrackPrice();
  }, [userId, productId]);

  const minPrice = Math.min(...priceVariations.map((variation) => variation.price));
  const maxPrice = Math.max(...priceVariations.map((variation) => variation.price));
  const adjustedMinPrice = minPrice - 3000;
  const adjustedMaxPrice = maxPrice + 3000;

  const chartData = priceVariations
  .filter((variation) => {
    const variationDate = new Date(variation.date);
    const threeMonthsAgo = new Date();
    threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
    return variationDate >= threeMonthsAgo;
  })
  .map((variation) => ({
    date: variation.date,
    price: variation.price,
  }));
  const handleTrackPrice = async () => {
    const price = Number(trackPrice);

    if (trackPrice === '' || isNaN(price)) {
      setErrorMessage('Please enter a valid price');
      setSuccessMessage('');
      setTimeout(() => setErrorMessage(''), 5000);
      return;
    }

    if (price < lowestPrice || price > highestPrice) {
      setErrorMessage(`Price should be between ₹${lowestPrice.toLocaleString()} and ₹${highestPrice.toLocaleString()}`);
      setSuccessMessage('');
      setTimeout(() => setErrorMessage(''), 5000);
      return;
    }

    setErrorMessage('');
    setSuccessMessage('Updating Tracking Price...');
    setIsLoading(true);

    if (!userId) {
      setErrorMessage('User not logged in');
      console.log("User ID is missing; user needs to be logged in.");
      setIsLoading(false);
      return;
    }

    console.log("Sending request with:", { userId, productId, trackPrice: price });

    try {
      const response = await fetch('/api/updateTrackingPrice', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          productId,
          trackPrice: price,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update tracking price');
      }

      setTrackPrice('');
      setSuccessMessage('Tracking Price Updated!');
      setTimeout(() => setSuccessMessage(''), 5000);

    } catch (error: unknown) {
      if (error instanceof Error) {
        setErrorMessage(error.message || 'Failed to update tracking price');
      } else {
        setErrorMessage('An unexpected error occurred.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleUntrack = async () => {
    try {
      const response = await fetch('/api/untrackProduct', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, productId }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to untrack the product');
      }

      setSuccessMessage('Product successfully untracked');
      window.location.reload();
      setTimeout(() => setSuccessMessage(''), 5000);

    } catch (error) {
      if (error instanceof Error) {
        setErrorMessage(error.message || 'Failed to untrack the product');
      } else {
        setErrorMessage('An unexpected error occurred.');
      }
    }
  };

  return (
    <li className="bg-white shadow-lg p-6 justify-center items-center rounded-lg flex flex-col sm:flex-row gap-6 w-full max-w-screen-xl mx-auto border border-gray-300">
      <div className="w-full sm:w-[23%] flex justify-center items-center border border-gray-300 flex-grow">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover rounded-lg shadow-sm transition-transform hover:scale-105"
        />
      </div>

      <div className="w-full sm:w-[38%] p-4 rounded-lg flex flex-col items-start text-left space-y-4">
        <h1 className="text-2xl font-semibold text-gray-800 border-b-4 w-full border-red-500 pb-2 mb-0">
          {name || 'No name available'}
        </h1>

        <div className="text-2xl ml-3 font-bold text-gray-900">
          ₹{currentPrice ? currentPrice.toLocaleString() : 'N/A'}
        </div>

        <div className="flex gap-2 justify-start">
          <p className="bg-green-100 text-green-600 px-2 py-1 rounded-md font-semibold w-30 text-center text-sm">
            Lowest: ₹{lowestPrice ? lowestPrice.toLocaleString() : 'N/A'}
          </p>
          <p className="bg-red-100 text-red-600 px-2 py-1 rounded-md font-semibold w-30 text-center text-sm">
            Highest: ₹{highestPrice ? highestPrice.toLocaleString() : 'N/A'}
          </p>
        </div>

        <div className="flex flex-col gap-2 justify-start mt-4 w-full">
          <label htmlFor="trackPrice" className="text-sm font-semibold text-gray-700">
            Enter the price to track:
          </label>
          <div className="flex gap-2">
          <input
            id="trackPrice"
            type="number"
            min={lowestPrice || 0}
            max={highestPrice || 0}
            placeholder={trackPrice || "Price"}  // Use trackPrice as the placeholder
            value={trackPrice || ""}  // Keep the value tied to the trackPrice state
            onChange={(e) => setTrackPrice(e.target.value)}  // Update trackPrice when the user types
            className="w-full sm:w-[calc(100%-100px)] p-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <button
            onClick={handleTrackPrice} // Execute the track price logic
            className="w-28 py-2 bg-blue-500 text-white rounded-md font-semibold shadow-md transform hover:bg-blue-600 hover:scale-105 transition-all"
          >
            Submit
          </button>
          </div>

          {errorMessage && (
            <p className="text-red-500 text-xs ml-3 mt-2">
              {errorMessage}
            </p>
          )}
          {successMessage && (
            <p className="text-green-500 text-xs ml-3 mt-2">
              {successMessage}
            </p>
          )}
        
        </div>

        <div className="flex gap-2 justify-start mt-4 w-full">
          <button onClick={handleUntrack} className="w-28 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-md font-semibold shadow-md transform hover:scale-110 hover:bg-red-700 hover:shadow-xl transition-all duration-300">
            Untrack
          </button>

          <button
            onClick={() => {
              if (url) {
                window.open(url, '_blank');
              } else {
                console.error('No URL provided for the Buy Now button.');
              }
            }}
            className="w-28 py-2 bg-green-500 text-white rounded-md font-semibold shadow-md transform hover:scale-110 hover:bg-green-600 hover:shadow-xl transition-all duration-300"
          >
            Buy Now
          </button>
        </div>
      </div>

      <div className="w-full sm:w-[33%] flex justify-center items-center flex-grow">
        <div className="w-full min-h-[300px] md:h-[350px] flex justify-center items-center">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid stroke="#e0e0e0" strokeDasharray="3 3" />
              <XAxis dataKey="date" stroke="#888" />
              <YAxis domain={[adjustedMinPrice, adjustedMaxPrice]} stroke="#888" />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="price"
                stroke="#ff6f61"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </li>
  );
};

export default TrackCard;
