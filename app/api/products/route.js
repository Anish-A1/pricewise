import dbConnect from '../../../lib/dbConnect';
import Product from '../../../models/Product';

// This handles the GET request to either fetch all products or a specific product by URL
export async function GET(req) {
  // Establish a database connection
  await dbConnect();

  // Get the URL parameter from the query string
  const { searchParams } = new URL(req.url);
  const url = searchParams.get('url');  // Query parameter for URL

  try {
    if (url) {
      // If a URL is provided, find the specific product by URL
      const product = await Product.findOne({ url });

      if (!product) {
        return new Response(
          JSON.stringify({ error: `Product with URL '${url}' not found` }),
          {
            status: 404,
            headers: { 'Content-Type': 'application/json' },
          }
        );
      }

      // Return the found product data
      return new Response(
        JSON.stringify(product),
        {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    } else {
      // If no URL is provided, return all products (with a limit to avoid huge responses)
      const products = await Product.find({}).limit(10);  // Limit the results to 10 for better performance

      return new Response(
        JSON.stringify(products),
        {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }
  } catch (error) {
    console.error('Error fetching products:', error);
    // Return a generic error response in case of failure
    return new Response(
      JSON.stringify({ error: 'Failed to fetch products. Please try again later.' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}
