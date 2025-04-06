import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken'; // JWT library
import connectToDatabase from '../../../lib/dbConnect'; // MongoDB connection
import Tracked from '../../../models/Tracked'; // Tracked model
import Product from '../../../models/Product'; // Product model

// Define the types for the tracked product
interface PriceVariation {
  price: number;
  date: string;
}

interface TrackedProduct {
  productId: {
    _id: string;
    name: string;
    currentPrice: number;
    lowestPrice: number;
    highestPrice: number;
    rating: number;
    image: string;
    desc: string;
    website: string;
    priceVariations: PriceVariation[]; // Include priceVariations
  };
}

interface TrackedDocument {
  trackedProducts: Array<{
    productId: any; // This is a reference to the Product model
    dateTracked: string;
  }>;
}

export async function GET(req: Request) {
  try {
    // Get the token from the Authorization header
    const token = req.headers.get('Authorization')?.split(' ')[1]; // "Bearer <token>"

    if (!token) {
      return NextResponse.json({ message: 'No token provided' }, { status: 401 });
    }

    // Decode the token to extract userId (replace 'yourSecretKey' with your actual secret key used to sign the JWT)
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!); // Use the secret from environment variables
    const userId = decoded.userId;

    if (!userId) {
      return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
    }

    // Connect to the database
    await connectToDatabase();

    // Find the tracked products for the user
    const trackedData = await Tracked.findOne({ userId })
      .populate({
        path: 'trackedProducts.productId', // Populating the productId
        model: 'Product',
        select: '_id url name currentPrice lowestPrice highestPrice rating image desc website priceVariations', // Select fields to return, including priceVariations
      })
      .exec();

    if (!trackedData) {
      return NextResponse.json({ message: 'No products are being tracked yet.' }, { status: 200 });
    }

    // Ensure the type of trackedData.trackedProducts is correct
    const trackedProducts: TrackedProduct[] = trackedData.trackedProducts.map(
      (tracked: TrackedDocument['trackedProducts'][number]) => ({
        productId: tracked.productId, // Mapping product data including price variations
      })
    );

    return NextResponse.json({ trackedProducts });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Error fetching tracked products' }, { status: 500 });
  }
}
