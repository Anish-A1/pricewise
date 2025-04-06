import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';
import Product from '@/models/Product';
import Tracked from '@/models/Tracked';
import nodemailer from 'nodemailer';

export async function POST(req) {
  // Step 1: Database Connection
  try {
    await dbConnect();
  } catch (error) {
    return new Response('Database connection failed', { status: 500 });
  }

  let email, productId;

  // Step 2: Parse and Validate Request Data
  try {
    const body = await req.json();
    email = body.email;
    productId = body.productId;

    if (!email || !productId) {
      return new Response('Invalid request data', { status: 400 });
    }
  } catch (error) {
    return new Response('Invalid JSON body', { status: 400 });
  }

  let user;

  // Step 3: Fetch User
  try {
    user = await User.findOne({ email });
    if (!user) {
      return new Response('User not found', { status: 404 });
    }
  } catch (error) {
    return new Response('Failed to fetch user', { status: 500 });
  }

  let product;

  // Step 4: Fetch Product
  try {
    product = await Product.findById(productId);
    if (!product) {
      return new Response('Product not found', { status: 404 });
    }
  } catch (error) {
    return new Response('Failed to fetch product', { status: 500 });
  }

  let tracked;

  // Step 5: Track Product
  try {
    tracked = await Tracked.findOne({ userId: user._id });

    if (tracked) {
      const alreadyTracked = tracked.trackedProducts.some(
        (item) => item.productId.toString() === product._id.toString()
      );

      if (alreadyTracked) {
        return new Response('Product already tracked', { status: 400 });
      }

      // Add new product to tracking list
      tracked.trackedProducts.push({
        productId: product._id,
        dateTracked: new Date().toISOString(),
        trackPrice: product.currentPrice,
      });
    } else {
      tracked = new Tracked({
        userId: user._id,
        email,
        trackedProducts: [
          {
            productId: product._id,
            dateTracked: new Date().toISOString(),
            trackPrice: product.currentPrice,
          },
        ],
      });
    }

    await tracked.save();
  } catch (error) {
    return new Response('Failed to track product', { status: 500 });
  }

  // Step 6: Send Confirmation Email
  try {
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.verify();

    const mailOptions = {
      from: '"PriceWise" <your-email@example.com>',
      to: email,
      subject: 'Your Product Tracking Has Begun!',
      html: `
        <div style="font-family: 'Arial, sans-serif'; background-color: #f9f9f9; padding: 40px; color: #333;">
          <div style="max-width: 600px; margin: auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 8px 15px rgba(0, 0, 0, 0.1);">
            <!-- Header Section -->
            <div style="background: linear-gradient(90deg, #ff4d4f, #ff7875); color: white; padding: 30px; text-align: center;">
              <h1 style="font-size: 28px; font-weight: bold; margin: 0; text-transform: uppercase;">Tracking Confirmed!</h1>
              <p style="font-size: 16px; margin-top: 10px;">Price updates just got easier 📩</p>
            </div>
    
            <!-- Content Section -->
            <div style="padding: 30px;">
              <p style="font-size: 18px; margin-bottom: 20px; line-height: 1.6;">
                Hi <strong>${user.name || 'there'}</strong>,<br>
                We have successfully started tracking your product with <span style="color: #ff4d4f; font-weight: bold;">PriceWise</span>. Sit back, relax, and let us notify you of any price changes!
              </p>
    
              <div style="background-color: #fef7f7; padding: 20px; border-radius: 8px; margin-bottom: 20px; border: 1px solid #ffe0e0;">
                <p style="font-size: 16px; margin: 0; line-height: 1.8;">
                  <strong>Product Name:</strong> <span style="color: #ff4d4f;">${product.name}</span><br>
                  <strong>Current Price:</strong> ₹${product.currentPrice.toLocaleString()}
                </p>
              </div>
    
              <p style="font-size: 15px; color: #555; line-height: 1.6; margin-bottom: 20px;">
                We’re here to make shopping smarter for you. Get notified the moment your tracked product drops in price. Thank you for trusting <strong>PriceWise</strong>!
              </p>
            </div>
          </div>
        </div>
      `,
    };
    
    
    
    

    await transporter.sendMail(mailOptions);
  } catch (error) {
    return new Response('Failed to send confirmation email', { status: 500 });
  }

  // Step 7: Return Success Response
  return new Response('Product tracked successfully, email sent', { status: 200 });
}
