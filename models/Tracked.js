import mongoose from 'mongoose';
//models\Tracked.js
const trackedSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  trackedProducts: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
      },
      dateTracked: {
        type: String, // or Date type, depending on your needs
      },
      trackPrice: {
        type: Number, // Store the highest price at the time of tracking
        required: true,
      },
    },
  ],
});

export default mongoose.models.Tracked || mongoose.model('Tracked', trackedSchema);
