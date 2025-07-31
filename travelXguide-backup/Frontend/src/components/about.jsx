import { motion } from "framer-motion";

const About = () => {
  return (
    <section className="py-12 px-4 md:py-24 md:px-12 lg:px-24 bg-white">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mb-10 md:mb-16"
        >
          <span className="text-blue-600 font-semibold text-base">WHO WE ARE</span>
          <h2 className="text-2xl md:text-5xl font-bold mt-4 mb-4 md:mb-6">
            Redefining <span className="text-blue-600">Travel Experiences</span>
          </h2>
          <div className="w-16 md:w-20 h-1 bg-gradient-to-r from-blue-400 to-teal-400 mx-auto"></div>
        </motion.div>

        <div className="flex flex-col lg:flex-row items-center gap-8 md:gap-12">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="w-full lg:w-1/2 relative"
          >
            <img
              src="https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80"
              alt="Travel Experience"
              className="w-full rounded-2xl shadow-xl"
            />
            <div className="absolute -bottom-6 -right-6 bg-white p-4 rounded-xl shadow-lg hidden lg:block">
              <div className="text-2xl md:text-4xl font-bold text-blue-600">12+</div>
              <div className="text-gray-600 text-xs md:text-base">Years Experience</div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="w-full lg:w-1/2"
          >
            <h3 className="text-lg md:text-2xl font-bold mb-4 md:mb-6">
              Our mission is to make travel planning effortless and enjoyable
            </h3>
            <p className="text-gray-600 mb-4 md:mb-6 text-sm md:text-base">
              TravelX has grown from a small startup to a leading travel
              platform serving thousands of travelers worldwide. We combine cutting-edge
              technology with local expertise to deliver unforgettable experiences.
            </p>

            <div className="space-y-4 md:space-y-6">
              <div className="flex items-start">
                <div className="bg-blue-100 p-2 md:p-3 rounded-full mr-3 md:mr-4">
                  <svg className="w-5 h-5 md:w-6 md:h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                </div>
                <div>
                  <h4 className="font-semibold text-sm md:text-base">AI-Powered Recommendations</h4>
                  <p className="text-gray-600 mt-1 text-xs md:text-sm">
                    Our algorithms analyze your preferences to suggest perfect destinations.
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="bg-blue-100 p-2 md:p-3 rounded-full mr-3 md:mr-4">
                  <svg className="w-5 h-5 md:w-6 md:h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                </div>
                <div>
                  <h4 className="font-semibold text-sm md:text-base">Local Experts</h4>
                  <p className="text-gray-600 mt-1 text-xs md:text-sm">
                    We work with trusted guides who know their destinations intimately.
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="bg-blue-100 p-2 md:p-3 rounded-full mr-3 md:mr-4">
                  <svg className="w-5 h-5 md:w-6 md:h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                </div>
                <div>
                  <h4 className="font-semibold text-sm md:text-base">Sustainable Travel</h4>
                  <p className="text-gray-600 mt-1 text-xs md:text-sm">
                    We're committed to eco-friendly practices that protect our planet.
                  </p>
                </div>
              </div>
            </div>

            <button className="mt-6 md:mt-8 px-6 md:px-8 py-2 md:py-3 bg-gradient-to-r from-blue-600 to-teal-500 text-white rounded-lg font-semibold hover:shadow-lg transition-all text-sm md:text-base">
              Learn More About Us
            </button>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default About;