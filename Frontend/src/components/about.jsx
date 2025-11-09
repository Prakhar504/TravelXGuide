import { motion, useInView } from "framer-motion";
import { useRef, useEffect, useState } from "react";

const About = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const [counts, setCounts] = useState({ years: 0, customers: 0, guides: 0, countries: 0 });

  useEffect(() => {
    if (isInView) {
      const duration = 2000;
      const steps = 60;
      const interval = duration / steps;
      
      const targets = { years: 12, customers: 50000, guides: 500, countries: 120 };
      let currentStep = 0;

      const timer = setInterval(() => {
        currentStep++;
        const progress = currentStep / steps;
        
        setCounts({
          years: Math.floor(targets.years * progress),
          customers: Math.floor(targets.customers * progress),
          guides: Math.floor(targets.guides * progress),
          countries: Math.floor(targets.countries * progress)
        });

        if (currentStep >= steps) {
          setCounts(targets);
          clearInterval(timer);
        }
      }, interval);

      return () => clearInterval(timer);
    }
  }, [isInView]);

  return (
    <section className="py-12 px-4 md:py-24 md:px-12 lg:px-24 bg-white relative overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-50 rounded-full filter blur-3xl opacity-30 -translate-y-1/2 translate-x-1/2"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-teal-50 rounded-full filter blur-3xl opacity-30 translate-y-1/2 -translate-x-1/2"></div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mb-10 md:mb-16"
        >
          <span className="text-blue-600 font-semibold text-base uppercase tracking-wider">WHO WE ARE</span>
          <h2 className="text-2xl md:text-5xl font-bold mt-4 mb-4 md:mb-6">
            Redefining{" "}
            <span className="bg-gradient-to-r from-blue-600 to-teal-500 bg-clip-text text-transparent">
              Travel Experiences
            </span>
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
            <div className="relative rounded-3xl overflow-hidden shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80"
                alt="Travel Experience"
                className="w-full h-full object-cover"
              />
              {/* Overlay Gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
            </div>
            
            {/* Floating Stats Cards */}
            <motion.div
              ref={ref}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="absolute -bottom-6 -right-6 bg-white p-6 rounded-2xl shadow-2xl hidden lg:block border-2 border-blue-100"
            >
              <div className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-teal-500 bg-clip-text text-transparent">
                {counts.years}+
              </div>
              <div className="text-gray-600 text-sm font-medium mt-1">Years Experience</div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
              className="absolute -top-6 -left-6 bg-gradient-to-r from-blue-600 to-teal-500 p-6 rounded-2xl shadow-2xl hidden lg:block"
            >
              <div className="text-4xl font-bold text-white">
                {counts.guides}+
              </div>
              <div className="text-blue-100 text-sm font-medium mt-1">Expert Guides</div>
            </motion.div>
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