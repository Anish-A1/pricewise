// app/api/untrackProduct/route.js
import { NextResponse } from 'next/server';
import dbConnect from '../../../lib/dbConnect';
import Tracked from '../../../models/Tracked';
import Product from '../../../models/Product';

export async function POST(req) {
  try {
    // Connect to the database
    await dbConnect();

    // Parse the request body
    const { userId, productId } = await req.json();

    // Ensure the userId and productId are provided
    if (!userId || !productId) {
      return NextResponse.json({ error: 'User ID and Product ID are required' }, { status: 400 });
    }

    console.log(`Untracking product with ID: ${productId} for user ID: ${userId}`);

    // Find the user’s tracked document
    const trackedDocument = await Tracked.findOne({ userId });
    if (!trackedDocument) {
      return NextResponse.json({ error: 'User not found or not tracking any products' }, { status: 404 });
    }

    // Find the tracked product in the trackedProducts array
    const productIndex = trackedDocument.trackedProducts.findIndex(item => item.productId.toString() === productId);

    // If the product is not found in the tracked list
    if (productIndex === -1) {
      return NextResponse.json({ error: 'Product not found in the tracked list' }, { status: 404 });
    }

    // Remove the product from the trackedProducts array
    trackedDocument.trackedProducts.splice(productIndex, 1);
    await trackedDocument.save();

    console.log(`Successfully untracked product with ID: ${productId}`);

    // Return success response
    return NextResponse.json({ message: 'Product successfully untracked' });

  } catch (error) {
    console.error('Error untracking product:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
