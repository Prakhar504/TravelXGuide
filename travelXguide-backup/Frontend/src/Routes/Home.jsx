import { motion } from "framer-motion";
import Hero from "../components/hero";
import Navbar from "../components/Navbar";
import ImageScroll from "../components/ImagesScroll";
import About from "../components/about";
import Footer from "../components/footer";



function Home() {
  return (
    <div className="overflow-x-hidden">
      {/* Navbar + Hero */}
      <div className="relative w-full min-h-[60vh] md:h-screen">
        <Navbar />
        <Hero />
        
        {/* Scroll indicator (desktop only) */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex flex-col items-center hidden md:flex"
        >
          <span className="text-white mb-2 text-sm">Scroll Down</span>
          <div className="w-5 h-8 border-2 border-white rounded-full flex justify-center">
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-1 h-2 bg-white rounded-full mt-1"
            />
          </div>
        </motion.div>
      </div>

      {/* Features Section */}
      

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
        className="min-h-screen flex items-center justify-center py-20 bg-gray-50"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        viewport={{ once: true }}
      >
        <ImageScroll />
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