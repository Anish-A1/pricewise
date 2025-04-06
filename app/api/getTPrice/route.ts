import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '../../../lib/dbConnect';
import Tracked from '../../../models/Tracked';
import { Types } from 'mongoose';

// Define the interface for TrackedProduct
interface TrackedProduct {
  productId: Types.ObjectId; // Use ObjectId type for the reference
  trackPrice: number;
}

export async function POST(req: NextRequest) {
  try {
    const { userId, productId } = await req.json();

    if (!userId || !productId) {
      return NextResponse.json({ message: 'UserId and ProductId are required' }, { status: 400 });
    }

    // Convert productId to ObjectId
    const productObjectId = new Types.ObjectId(productId);

    // Connect to the database
    await dbConnect();

    // Fetch the user's tracked products
    const tracked = await Tracked.findOne({ userId })
      .populate({
        path: 'trackedProducts.productId',
        select: 'name',  // Add any other fields you need from the Product model
      });

    if (!tracked) {
      return NextResponse.json({ message: 'Tracked data not found' }, { status: 404 });
    }

    // Search for the productId in the trackedProducts array
    const trackedProduct = tracked.trackedProducts.find(
      (product: TrackedProduct) => product.productId.equals(productObjectId) // Use equals() for ObjectId comparison
    );

    if (!trackedProduct) {
      return NextResponse.json({ message: 'Tracked product not found' }, { status: 404 });
    }

    const trackPrice = trackedProduct.trackPrice;

    // Return the tracking price, ensuring the productId is properly converted to a string
    return NextResponse.json({ trackPrice, productId: productObjectId.toString() });
  } catch (error) {
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
