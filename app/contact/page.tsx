export default function ContactPage() {
  const cardWidth = "w-[480px]";

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
          <ContactCard
            initials="AD"
            name="Aditya D P"
            role="Machine Learning"
            email="aditya@example.com"
            gradient="from-red-500 to-yellow-500"
            cardWidth={cardWidth}
            color="red"
          />

          <ContactCard
            initials="AA"
            name="Anish"
            role="Full-Stack Development"
            email="anish@example.com"
            gradient="from-blue-500 to-purple-500"
            cardWidth={cardWidth}
            color="blue"
          />

          <ContactCard
            initials="KK"
            name="Karthik Khandige"
            role="Email Notifications"
            email="karthik@example.com"
            gradient="from-green-500 to-teal-500"
            cardWidth={cardWidth}
            color="green"
          />

          <ContactCard
            initials="KA"
            name="Karthika Krishna"
            role="Web Scraping"
            email="karthika@example.com"
            gradient="from-red-500 to-red-700"
            cardWidth={cardWidth}
            color="red"
          />
        </div>
      </section>
    </div>
  );
}

type ContactCardProps = {
  initials: string;
  name: string;
  role: string;
  email: string;
  gradient: string;
  cardWidth: string;
  color: "red" | "blue" | "green";
};

function ContactCard({
  initials,
  name,
  role,
  email,
  gradient,
  cardWidth,
  color,
}: ContactCardProps) {
  const emailColor = {
    red: "text-red-500",
    blue: "text-blue-500",
    green: "text-green-500",
  }[color];

  return (
    <div
      className={`flex flex-col items-center p-10 bg-white shadow-xl rounded-xl transform ${cardWidth} hover:scale-102 hover:translate-y-[-5px] transition-all duration-200 ease-in-out`}
    >
      <div
        className={`w-20 h-20 bg-gradient-to-r ${gradient} rounded-full mb-6 flex justify-center items-center text-white text-4xl font-bold`}
      >
        {initials}
      </div>
      <div className="text-3xl font-semibold text-gray-800 mb-3">{name}</div>
      <div className="text-gray-700 text-xl mb-5">{role}</div>
      <a href={`mailto:${email}`} className={`${emailColor} hover:underline text-lg`}>
        {email}
      </a>
    </div>
  );
}
