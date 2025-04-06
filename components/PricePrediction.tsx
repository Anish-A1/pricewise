import { useState } from 'react';

const FetchPrediction = () => {
  const [predictionData, setPredictionData] = useState(null);

  const getPrediction = async () => {
    try {
      const response = await fetch('/api/pricePrediction', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ productId: 'exampleProductId' }), // Replace with actual productId
      });
      const data = await response.json();
      setPredictionData(data);
    } catch (error) {
      console.error('Error fetching prediction:', error);
    }
  };

  return (
    <div>
      <button onClick={getPrediction}>Get Prediction</button>
      {predictionData && (
        <div>
          <h2>Prediction Results</h2>
          <pre>{JSON.stringify(predictionData, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default FetchPrediction;
