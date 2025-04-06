import { useEffect, useState } from "react";
import { useRouter } from "next/router";

const ProductDetails = () => {
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { query } = useRouter();
  const { id } = query;  // Get the product id from the URL query

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const response = await fetch(`/api/products?url=${id}`);
        const data = await response.json();
        if (response.ok) {
          setProduct(data);
        } else {
          setError('Product not found');
        }
      } catch (error) {
        setError('Error fetching product details');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <h1>{product?.name}</h1>
      <img src={product?.image} alt={product?.name} />
      <p>{product?.desc}</p>
      <div>
        <p>Current Price: ₹{product?.currentPrice}</p>
        <p>Lowest Price: ₹{product?.lowestPrice}</p>
        <p>Highest Price: ₹{product?.highestPrice}</p>
      </div>
      <div>
        <p>Rating: {product?.rating}</p>
      </div>
    </div>
  );
};

export default ProductDetails;
