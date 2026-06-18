import { motion } from 'framer-motion';

const ThreeDGlobe = () => {
  return (
    <motion.div
      className="w-full h-64 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="text-center">
        <div className="text-6xl mb-4">🌍</div>
        <p className="text-gray-400">Visitor Globe</p>
        <p className="text-sm text-gray-500">Loading 3D visualization...</p>
      </div>
    </motion.div>
  );
};

export default ThreeDGlobe;