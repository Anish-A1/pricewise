// app/products/[id]/page.tsx

import { GetServerSideProps } from 'next';
import dbConnect from '../../../lib/dbConnect'; // Ensure this is connected
import Product from '../../../models/Product'; // The Product model for MongoDB
import { ProductType } from '../../../types/types'; // You can define the types if necessary

// This function will run on the server side and fetch data for this page
export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const { id } = params as { id: string };

  // Establish a connection to the database
  await dbConnect();

  // Fetch the product by ID
  const product = await Product.findById(id);

  if (!product) {
    return {
      notFound: true, // If product not found, return a 404
    };
  }

  // Return product details as props
  return {
    props: {
      product: JSON.parse(JSON.stringify(product)), // Ensure the object is serializable
    },
  };
};

// ProductDetails Component
const ProductDetails = ({ product }: { product: ProductType }) => {
  return (
    <div>
      <h1>{product.name}</h1>
      <img src={product.image} alt={product.name} />
      <p>{product.desc}</p>
      <p>Price: ${product.currentPrice}</p>
      <p>Rating: {product.rating}</p>
      {/* Render other product details */}
    </div>
  );
};

export default ProductDetails;
