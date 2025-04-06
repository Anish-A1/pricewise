"use client";

import Image from "next/image";

interface Feature {
  title: string;
  description: string;
  icon: string; // Path to the icon
}

const features: Feature[] = [
  {
    title: "Track Prices in Real-Time",
    description:
      "Stay informed with live price tracking across your favorite products and categories, helping you shop smarter every day.",
    icon: "/assets/features/tag-price-discount-svgrepo-com.svg",
  },
  {
    title: "Visualize Price Trends",
    description:
      "Analyze historical price data with intuitive graphs to uncover valuable insights and make confident shopping decisions.",
    icon: "/assets/features/chart-line-svgrepo-com.svg",
  },
  {
    title: "Get Email Notifications",
    description:
      "Receive timely alerts in your inbox about price drops, ensuring you never miss an opportunity to save.",
    icon: "/assets/features/mail-notification-2-svgrepo-com.svg",
  },
];

const Features = () => {
  return (
    <div className="bg-light-blue-50 p-8 mt-13">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {features.map((feature, index) => (
          <div
            key={index}
            className="flex items-center gap-6 p-4 rounded-lg bg-white shadow-md transition-all transform "
          >
            <Image
              src={feature.icon}
              alt={feature.title}
              width={40}
              height={40}
              className="flex-shrink-0"
            />
            <div>
              <h4 className="font-bold text-xl text-blue-500">
                {feature.title}
              </h4>
              <p className="text-gray-700 text-sm">{feature.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Features;
