// types/types.ts

export interface PriceVariation {
  price: number;
  date: string;
}

export interface ProductType {
  _id: string;
  url: string;
  image: string;
  name: string;
  currentPrice: number;
  lowestPrice: number;
  highestPrice: number;
  currency: string;  // Add this line to include currency
  rating: number;
  website: string;
  priceVariations: PriceVariation[];
  desc: string;
}
