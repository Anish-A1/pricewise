import Image from "next/image";

export default function AboutPage() {
  const cardWidth = "w-[330px]";
  const cardHeight = "h-[430px]";

  return (
    <section className="px-6 md:px-10 lg:px-24 py-5">
      <h1 className="ml-4 text-5xl font-bold text-gray-800 mb-7 relative tracking-wide text-center">
        About Us
        <span
          className="-mt-3 absolute bottom-0 left-1/2 transform -translate-x-1/2 h-1 bg-red-500 rounded-full"
          style={{ top: "60px", width: "60%" }}
        ></span>
      </h1>

      <p className="text-xl text-black mb-8 text-center">
        Welcome to <span className="font-bold text-primary">PriceWise</span>. We are dedicated to helping you shop smarter with cutting-edge tools and insightful analytics. Our goal is to make your shopping experience seamless, informed, and cost-effective.
      </p>

      {/* How It Works Section */}
      <div className="mb-12">
        <h2 className="text-4xl font-semibold text-gray-800 mb-8 relative pl-4 text-center">
          How It Works
        </h2>

        <div className="flex flex-wrap justify-center items-center gap-6">
          {/* Card: Search */}
          <Card
            width={cardWidth}
            height={cardHeight}
            imgSrc="assets/features/undraw_undraw_undraw_undraw_undraw_undraw_undraw_undraw_undraw_search_engines_041x_-2-_cl95_o7o8_pigd_-1-_wbm3_t5p8_-1-_mt5l_-2-_dhxr_-2-_nmxe.svg"
            title="Search"
            description="Start by providing a product URL from your favorite websites. Our system extracts the data you need in seconds."
          />

          {/* Card: Analysis */}
          <Card
            width={cardWidth}
            height={cardHeight}
            imgSrc="assets/features/undraw_visual_data_re_mxxo.svg"
            title="Analysis"
            description="Explore detailed graphs and visualizations of price trends to identify patterns and make informed decisions."
          />

          {/* Card: Prediction */}
          <Card
            width={cardWidth}
            height={cardHeight}
            imgSrc="/assets/features/undraw_predictive_analytics_re_wxt8.svg"
            title="Prediction"
            description="Utilize our advanced algorithms to predict if a product's price is likely to drop in the near future."
          />

          {/* Card: Tracking */}
          <Card
            width={cardWidth}
            height={cardHeight}
            imgSrc="assets/features/undraw_progress_tracking_re_ulfg.svg"
            title="Tracking"
            description="Monitor price fluctuations and ensure you never miss a deal with our real-time tracking tools."
          />

          {/* Card: Notifications */}
          <Card
            width={cardWidth}
            height={cardHeight}
            imgSrc="assets/features/undraw_envelope_re_f5j4.svg"
            title="Notifications"
            description="Stay updated with timely email notifications about price drops, ensuring you never miss an opportunity to save."
          />
        </div>
      </div>
    </section>
  );
}

// ✅ Reusable Card component
type CardProps = {
  width: string;
  height: string;
  imgSrc: string;
  title: string;
  description: string;
};

function Card({ width, height, imgSrc, title, description }: CardProps) {
  return (
    <div
      className={`${width} ${height} bg-white shadow-xl rounded-lg overflow-hidden transition-transform transform hover:scale-105 hover:shadow-2xl`}
    >
      <div className="w-full h-2/3 relative overflow-hidden border border-gray-300">
        <Image
          src={imgSrc}
          alt={title}
          layout="fill"
          objectFit="contain"
          className="rounded-t-lg"
        />
      </div>
      <div className="p-6 flex flex-col justify-center items-center text-center">
        <h4 className="font-semibold text-xl text-blue-500 mb-3">{title}</h4>
        <p className="text-sm text-black">{description}</p>
      </div>
    </div>
  );
}
