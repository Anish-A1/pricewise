import fs from 'fs';
import path from 'path';

export async function POST(req) {
  const { priceVariations } = await req.json(); // Get data from the request body

  if (!priceVariations || priceVariations.length === 0) {
    return new Response(JSON.stringify({ message: 'No price variations provided' }), { status: 400 });
  }

  try {
    // Define file path for CSV inside the 'csv' folder
    const directoryPath = path.join(process.cwd(), 'csv');
    
    // Ensure the directory exists
    if (!fs.existsSync(directoryPath)) {
      fs.mkdirSync(directoryPath); // Create the directory if it doesn't exist
    }

    const filePath = path.join(directoryPath, 'Prediction.csv'); // Path to the 'Prediction.csv'

    // Prepare CSV data
    const csvRows = priceVariations.map(
      (variation) => `${variation.price},${variation.date}`
    );
    const csvContent = csvRows.join('\n');

    // Rewrite the CSV file with the new data
    // Instead of appending, we overwrite the existing file (if any)
    fs.writeFileSync(filePath, csvContent + '\n'); // Overwrite the file with new data

    return new Response(JSON.stringify({ message: 'Price variations saved successfully' }), { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ message: 'Error saving data to CSV' }), { status: 500 });
  }
}
