import video from "../assetss/video1.mp4";
import { motion } from "framer-motion";

function Hero() {
  return (
    <div className="relative w-full min-h-[60vh] md:h-screen overflow-hidden">
      {/* Video Background */}
      <video
        src={video}
        muted
        autoPlay
        loop
        playsInline
        className="absolute top-0 left-0 w-full h-full object-cover"
      />

      {/* Stats Bar */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.6 }}
        className="absolute bottom-4 md:bottom-10 left-0 right-0"
      >
        <div className="container mx-auto px-4">
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 flex flex-wrap justify-between max-w-4xl mx-auto">
            <div className="text-center px-2 py-1 flex-1 min-w-[100px]">
              <div className="text-xl md:text-3xl font-bold text-white">50K+</div>
              <div className="text-blue-200 text-xs md:text-base">Happy Travelers</div>
            </div>
            <div className="text-center px-2 py-1 flex-1 min-w-[100px]">
              <div className="text-xl md:text-3xl font-bold text-white">120+</div>
              <div className="text-blue-200 text-xs md:text-base">Destinations</div>
            </div>
            <div className="text-center px-2 py-1 flex-1 min-w-[100px]">
              <div className="text-xl md:text-3xl font-bold text-white">98%</div>
              <div className="text-blue-200 text-xs md:text-base">Positive Reviews</div>
            </div>
            <div className="text-center px-2 py-1 flex-1 min-w-[100px]">
              <div className="text-xl md:text-3xl font-bold text-white">24/7</div>
              <div className="text-blue-200 text-xs md:text-base">Support</div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default Hero;