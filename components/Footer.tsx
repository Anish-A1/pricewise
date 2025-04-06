const Footer = () => {
  return (
    <footer className="w-full bg-red-600 bg-opacity-90 backdrop-blur-lg shadow-md">
      <div className="max-w-screen-xl mx-auto px-6 py-4 flex justify-center items-center">
        <p className="text-sm text-white font-semibold tracking-wide">
          © {new Date().getFullYear()} PriceWise. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
