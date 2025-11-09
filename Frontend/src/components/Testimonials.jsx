import { motion } from "framer-motion";
import { FaStar, FaQuoteLeft } from "react-icons/fa";
import { useState } from "react";

const Testimonials = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const testimonials = [
    {
      name: "Sarah Johnson",
      location: "New York, USA",
      image: "https://randomuser.me/api/portraits/women/44.jpg",
      rating: 5,
      text: "TravelXGuide transformed my trip to Bali! The AI-powered itinerary was spot-on, and our local guide made the experience unforgettable. Highly recommended!",
      trip: "Bali Adventure"
    },
    {
      name: "Michael Chen",
      location: "Singapore",
      image: "https://randomuser.me/api/portraits/men/32.jpg",
      rating: 5,
      text: "Best travel planning platform I've used. The attention to detail and personalized recommendations saved us so much time. Our guide was incredibly knowledgeable!",
      trip: "European Tour"
    },
    {
      name: "Emma Rodriguez",
      location: "Barcelona, Spain",
      image: "https://randomuser.me/api/portraits/women/68.jpg",
      rating: 5,
      text: "As a solo traveler, I felt completely safe and supported. The guides are vetted professionals who truly care about showing you the authentic side of their cities.",
      trip: "Japan Discovery"
    },
    {
      name: "David Kumar",
      location: "Mumbai, India",
      image: "https://randomuser.me/api/portraits/men/52.jpg",
      rating: 5,
      text: "The platform's budget planning feature helped us stay within our means while still having an amazing experience. Customer support was responsive and helpful!",
      trip: "Thailand Getaway"
    },
    {
      name: "Lisa Anderson",
      location: "London, UK",
      image: "https://randomuser.me/api/portraits/women/27.jpg",
      rating: 5,
      text: "From booking to the actual trip, everything was seamless. The local guide we hired showed us places we never would have found on our own. Worth every penny!",
      trip: "Morocco Expedition"
    },
    {
      name: "James Taylor",
      location: "Sydney, Australia",
      image: "https://randomuser.me/api/portraits/men/18.jpg",
      rating: 5,
      text: "The AI recommendations were surprisingly accurate! Our family trip to Iceland was perfectly planned with activities for all ages. Can't wait to book our next adventure!",
      trip: "Iceland Family Trip"
    }
  ];

  const nextTestimonial = () => {
    setActiveIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setActiveIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <section className="py-16 md:py-24 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 relative overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-blue-200 rounded-full filter blur-3xl opacity-20 -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-200 rounded-full filter blur-3xl opacity-20 translate-x-1/2 translate-y-1/2"></div>

      <div className="container mx-auto px-4 md:px-6 lg:px-12 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-blue-600 font-semibold text-sm md:text-base uppercase tracking-wider">Testimonials</span>
          <h2 className="text-3xl md:text-5xl font-bold mt-4 mb-6">
            What Our{" "}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Travelers Say
            </span>
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Join thousands of satisfied travelers who've discovered their perfect journey with us
          </p>
        </motion.div>

        {/* Main Testimonial Carousel */}
        <div className="relative max-w-5xl mx-auto">
          <motion.div
            key={activeIndex}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 relative"
          >
            {/* Quote Icon */}
            <div className="absolute top-8 left-8 text-blue-200 opacity-50">
              <FaQuoteLeft className="text-5xl" />
            </div>

            <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
              {/* User Image */}
              <div className="flex-shrink-0">
                <img
                  src={testimonials[activeIndex].image}
                  alt={testimonials[activeIndex].name}
                  className="w-24 h-24 md:w-32 md:h-32 rounded-full object-cover border-4 border-blue-200 shadow-lg"
                />
              </div>

              {/* Content */}
              <div className="flex-1 text-center md:text-left">
                {/* Stars */}
                <div className="flex justify-center md:justify-start gap-1 mb-4">
                  {[...Array(testimonials[activeIndex].rating)].map((_, i) => (
                    <FaStar key={i} className="text-yellow-400 text-xl" />
                  ))}
                </div>

                {/* Testimonial Text */}
                <p className="text-gray-700 text-lg md:text-xl leading-relaxed mb-6 italic">
                  "{testimonials[activeIndex].text}"
                </p>

                {/* User Info */}
                <div className="space-y-1">
                  <h4 className="text-xl font-bold text-gray-900">
                    {testimonials[activeIndex].name}
                  </h4>
                  <p className="text-gray-500">
                    {testimonials[activeIndex].location}
                  </p>
                  <p className="text-blue-600 font-semibold">
                    {testimonials[activeIndex].trip}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Navigation Buttons */}
          <div className="flex justify-center gap-4 mt-8">
            <button
              onClick={prevTestimonial}
              className="w-12 h-12 rounded-full bg-white shadow-lg hover:shadow-xl flex items-center justify-center text-gray-700 hover:text-blue-600 transition-all duration-300 hover:scale-110"
            >
              ←
            </button>
            <button
              onClick={nextTestimonial}
              className="w-12 h-12 rounded-full bg-white shadow-lg hover:shadow-xl flex items-center justify-center text-gray-700 hover:text-blue-600 transition-all duration-300 hover:scale-110"
            >
              →
            </button>
          </div>

          {/* Dots Indicator */}
          <div className="flex justify-center gap-2 mt-6">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveIndex(index)}
                className={`transition-all duration-300 rounded-full ${
                  index === activeIndex
                    ? "w-8 h-3 bg-blue-600"
                    : "w-3 h-3 bg-gray-300 hover:bg-gray-400"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16 max-w-4xl mx-auto"
        >
          {[
            { value: "4.9/5", label: "Average Rating" },
            { value: "50K+", label: "Happy Customers" },
            { value: "98%", label: "Satisfaction Rate" },
            { value: "120+", label: "Countries Covered" }
          ].map((stat, index) => (
            <div key={index} className="bg-white rounded-2xl p-6 text-center shadow-lg">
              <div className="text-3xl font-bold text-blue-600 mb-2">{stat.value}</div>
              <div className="text-gray-600 text-sm">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Testimonials;
