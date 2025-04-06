import { FormEvent, useState } from "react";

interface SearchbarProps {
  setProductUrl: React.Dispatch<React.SetStateAction<string | null>>;
}

const Searchbar: React.FC<SearchbarProps> = ({ setProductUrl }) => {
  const [searchPrompt, setSearchPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null); // State to store error message

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null); // Reset error before each search

    try {
      const response = await fetch(`/api/products?url=${encodeURIComponent(searchPrompt)}`);
      const product = await response.json();

      if (response.ok && product) {
        setProductUrl(searchPrompt);
      } else {
        setError("Product Not Found"); // Set error message if product is not found
        setProductUrl(null);

        // Set a timeout to clear the error after 3 seconds
        setTimeout(() => {
          setError(null); // Clear the error after 3 seconds
        }, 3000);
      }
    } catch (error) {
      console.error("Error fetching product:", error);
      setError("There was an error fetching product data.");
      setProductUrl(null);

      // Clear the error after 3 seconds
      setTimeout(() => {
        setError(null);
      }, 3000);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="text-center">
      <form className="flex flex-col sm:flex-row justify-center gap-4" onSubmit={handleSubmit}>
        <input
          type="text"
          value={searchPrompt}
          onChange={(e) => setSearchPrompt(e.target.value)}
          placeholder="Enter product URL"
          className="w-96 px-6 py-3 border-2 border-gray--300 rounded-xl text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-300 shadow-md hover:shadow-lg"
        />
        <button
          type="submit"
          className={`w-36 px-6 py-3 text-sm rounded-xl font-semibold transition-all duration-300 transform shadow-lg ${
            searchPrompt === "" ? "bg-red-500 text-white cursor-not-allowed" : "bg-red-600 text-white hover:bg-red-700"
          }`}
          disabled={searchPrompt === ""}
        >
          {isLoading ? "Searching..." : "Search"}
        </button>
      </form>

      {/* Error message below the search bar */}
      {error && <p className="text-red-600 text-sm mt-2">{error}</p>}
    </div>
  );
};

export default Searchbar;
