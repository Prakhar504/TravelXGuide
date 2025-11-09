import { motion } from "framer-motion";
import Hero from "../components/hero";
import Navbar from "../components/Navbar";
import ImageScroll from "../components/ImagesScroll";
import About from "../components/about";
import Footer from "../components/footer";
import Features from "../components/Features";
import Testimonials from "../components/Testimonials";

function Home() {
  return (
    <div className="overflow-x-hidden">
      {/* Navbar + Hero */}
      <div className="relative w-full min-h-[70vh] md:h-screen">
        <Navbar />
        <Hero />
        
        {/* Scroll indicator (desktop only) */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          className="absolute bottom-10 left-1/2 transform -translate-x-1/2 hidden md:flex flex-col items-center z-30"
        >
          <span className="text-white mb-2 text-sm font-medium">Scroll Down</span>
          <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-1.5 h-2 bg-white rounded-full mt-2"
            />
          </div>
        </motion.div>
      </div>

      {/* Features Section */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <Features />
      </motion.div>

      {/* About Section */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <About />
      </motion.div>

      {/* Image Gallery */}
      <motion.div
        className="py-20 bg-gradient-to-b from-white to-gray-50"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        viewport={{ once: true }}
      >
        <div className="text-center mb-12">
          <span className="text-blue-600 font-semibold text-sm md:text-base uppercase tracking-wider">Gallery</span>
          <h2 className="text-3xl md:text-5xl font-bold mt-4 mb-6">
            Explore{" "}
            <span className="bg-gradient-to-r from-blue-600 to-teal-500 bg-clip-text text-transparent">
              Beautiful Destinations
            </span>
          </h2>
        </div>
        <ImageScroll />
      </motion.div>

      {/* Testimonials Section */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <Testimonials />
      </motion.div>

      {/* Call to Action Section */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="py-20 bg-gradient-to-r from-blue-600 to-purple-600"
      >
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
            Ready to Start Your Adventure?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of travelers who've discovered their perfect journey with TravelXGuide
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-8 py-4 bg-white text-blue-600 rounded-full font-semibold text-lg shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105">
              Plan Your Trip Now
            </button>
            <button className="px-8 py-4 bg-transparent border-2 border-white text-white rounded-full font-semibold text-lg hover:bg-white hover:text-blue-600 transition-all duration-300">
              Talk to an Expert
            </button>
          </div>
        </div>
      </motion.div>
      
      {/* Footer */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 1 }}
        viewport={{ once: true }}
      >
        <Footer />
      </motion.div>
    </div>
  );
}

export default Home;