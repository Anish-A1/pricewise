import mongoose from 'mongoose';
import dbConnect from '@/lib/dbConnect';
import Tracked from '@/models/Tracked';

export async function POST(request: Request) {
  let requestBody;
  try {
    requestBody = await request.json();
  } catch (error) {
    return new Response(
      JSON.stringify({
        message: 'Invalid JSON format in request body',
        error: error instanceof Error ? error.message : 'Unknown error',
      }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }

  const { userId, productId, trackPrice } = requestBody;

  if (!userId || !productId || trackPrice === undefined) {
    return new Response(
      JSON.stringify({ message: 'Missing required fields: userId, productId, and trackPrice are required' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }

  if (typeof trackPrice !== 'number' || isNaN(trackPrice)) {
    return new Response(
      JSON.stringify({ message: 'Invalid price format' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }

  let productIdObj;
  try {
    productIdObj = mongoose.Types.ObjectId.isValid(productId)
      ? new mongoose.Types.ObjectId(productId)
      : null;
    if (!productIdObj) throw new Error();
  } catch {
    return new Response(
      JSON.stringify({ message: 'Invalid product ID format' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }

  let userIdObj;
  try {
    userIdObj = mongoose.Types.ObjectId.isValid(userId)
      ? new mongoose.Types.ObjectId(userId)
      : null;
    if (!userIdObj) throw new Error();
  } catch {
    return new Response(
      JSON.stringify({ message: 'Invalid user ID format' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }

  try {
    await dbConnect();
  } catch (error) {
    return new Response(
      JSON.stringify({ message: 'Failed to connect to database' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }

  // Directly update the nested product's trackPrice
  try {
    const updatedResult = await Tracked.findOneAndUpdate(
      { userId: userIdObj, 'trackedProducts.productId': productIdObj },
      { $set: { 
        'trackedProducts.$.trackPrice': trackPrice,
        'trackedProducts.$.dateTracked': new Date()
      } },
      { new: true }
    );

    if (!updatedResult) {
      return new Response(
        JSON.stringify({ message: 'User or product not found' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ message: 'Tracking price updated successfully', updatedTrackedProducts: updatedResult.trackedProducts }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ message: 'Error saving updated tracking price', error: errorMessage }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
