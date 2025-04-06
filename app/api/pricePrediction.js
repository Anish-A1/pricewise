import fs from "fs";
import path from "path";
import csv from "csv-parser";

export default function handler(req, res) {
  if (req.method === "POST") {
    // Dynamically resolve the path
    const csvFilePath = path.join(process.cwd(), "csv", "Prediction.csv");

    const predictions = [];

    // Ensure the file exists before proceeding
    if (!fs.existsSync(csvFilePath)) {
      return res.status(500).json({ error: "CSV file not found" });
    }

    fs.createReadStream(csvFilePath)
      .pipe(csv({ headers: ["Price", "Date"] })) // Adjust headers as per your CSV structure
      .on("data", (row) => {
        predictions.push(row); // Collect each row
      })
      .on("end", () => {
        if (predictions.length === 0) {
          return res.status(404).json({ error: "No data available in the CSV" });
        }

        // You can add filtering here based on req.body if needed
        res.status(200).json({ predictions }); // Return all rows
      })
      .on("error", (error) => {
        console.error("Error reading CSV:", error);
        res.status(500).json({ error: "Failed to read CSV" });
      });
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
