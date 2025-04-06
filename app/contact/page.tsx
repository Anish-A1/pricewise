const Contact = ({ cardWidth = "w-[480px]" }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-6 md:px-10 lg:px-24 -mt-4">
      <section>
        <h1 className="text-5xl font-bold text-gray-800 mb-7 relative tracking-wide text-center">
          Contact
          <span
            className="absolute bottom-0 left-1/2 transform -translate-x-1/2 h-1 bg-red-500 rounded-full"
            style={{ top: "60px", width: "60%" }}
          ></span>
        </h1>
        {/* Contact Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div
            className={`flex flex-col items-center p-10 bg-white shadow-xl rounded-xl transform ${cardWidth} hover:scale-102 hover:translate-y-[-5px] transition-all duration-200 ease-in-out`}
          >
            <div className="w-20 h-20 bg-gradient-to-r from-red-500 to-yellow-500 rounded-full mb-6 flex justify-center items-center text-white text-4xl font-bold">
              AD
            </div>
            <div className="text-3xl font-semibold text-gray-800 mb-3">
              Aditya D P
            </div>
            <div className="text-gray-700 text-xl mb-5">
              Machine Learning
            </div>
            <a
              href="mailto:aditya@example.com"
              className="text-red-500 hover:underline text-lg"
            >
              aditya@example.com
            </a>
          </div>

          {/* Contact Card 2 - Frontend */}
          <div
            className={`flex flex-col items-center p-10 bg-white shadow-xl rounded-xl transform ${cardWidth} hover:scale-102 hover:translate-y-[-5px] transition-all duration-200 ease-in-out`}
          >
            <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mb-6 flex justify-center items-center text-white text-4xl font-bold">
              AA
            </div>
            <div className="text-3xl font-semibold text-gray-800 mb-3">
              Anish A
            </div>
            <div className="text-gray-700 text-xl mb-5">Full-Stack Development</div>
            <a
              href="mailto:anish@example.com"
              className="text-blue-500 hover:underline text-lg"
            >
              anish@example.com
            </a>
          </div>

          {/* Contact Card 3 - Email Notification */}
          <div
            className={`flex flex-col items-center p-10 bg-white shadow-xl rounded-xl transform ${cardWidth} hover:scale-102 hover:translate-y-[-5px] transition-all duration-200 ease-in-out`}
          >
            <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-teal-500 rounded-full mb-6 flex justify-center items-center text-white text-4xl font-bold">
              KK
            </div>
            <div className="text-3xl font-semibold text-gray-800 mb-3">
              Karthik Khandige
            </div>
            <div className="text-gray-700 text-xl mb-5">
              Email Notifications
            </div>
            <a
              href="mailto:karthik@example.com"
              className="text-green-500 hover:underline text-lg"
            >
              karthik@example.com
            </a>
          </div>

          {/* Contact Card 4 - Web Scraping */}
          <div
            className={`flex flex-col items-center p-10 bg-white shadow-xl rounded-xl transform ${cardWidth} hover:scale-102 hover:translate-y-[-5px] transition-all duration-200 ease-in-out`}
          >
            <div className="w-20 h-20 bg-gradient-to-r from-red-500 to-red-700 rounded-full mb-6 flex justify-center items-center text-white text-4xl font-bold">
              KA
            </div>
            <div className="text-3xl font-semibold text-gray-800 mb-3">
              Karthika Krishna
            </div>
            <div className="text-gray-700 text-xl mb-5">
              Web Scraping
            </div>
            <a
              href="mailto:karthika@example.com"
              className="text-red-500 hover:underline text-lg"
            >
              karthika@example.com
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
