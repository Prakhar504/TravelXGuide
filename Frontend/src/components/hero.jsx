import video from "../assetss/video1.mp4";

function Hero() {
  return (
    <div className="relative w-full min-h-[70vh] md:h-screen overflow-hidden">
      {/* Simple Video Background */}
      <video
        src={video}
        muted
        autoPlay
        loop
        playsInline
        className="absolute top-0 left-0 w-full h-full object-cover"
      />
    </div>
  );
}

export default Hero;