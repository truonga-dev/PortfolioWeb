import { motion } from 'framer-motion';
import { FiHome, FiArrowLeft } from 'react-icons/fi';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-dark-950 flex items-center justify-center relative overflow-hidden">
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-500/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl"></div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center relative z-10 px-4"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
          className="text-[150px] md:text-[200px] font-black leading-none bg-gradient-to-r from-primary-500 to-purple-600 bg-clip-text text-transparent"
        >
          404
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-6xl mb-6"
        >
          🧭
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-3xl md:text-4xl font-bold mb-4"
        >
          Page Not Found
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="text-gray-400 max-w-md mx-auto mb-8 text-lg"
        >
          Oops! The page you're looking for doesn't exist or has been moved.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="flex gap-4 justify-center flex-wrap"
        >
          <Link
            to="/"
            className="px-8 py-3 bg-primary-600 hover:bg-primary-700 rounded-xl font-semibold flex items-center gap-2 transition-all shadow-lg shadow-primary-500/20"
          >
            <FiHome /> Back to Home
          </Link>
          <button
            onClick={() => window.history.back()}
            className="px-8 py-3 border border-white/20 hover:border-white/40 rounded-xl font-semibold flex items-center gap-2 transition-all"
          >
            <FiArrowLeft /> Go Back
          </button>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="text-gray-600 text-sm mt-12"
        >
          Lost? Don't worry, even the best explorers get lost sometimes. 🗺️
        </motion.p>
      </motion.div>
    </div>
  );
};

export default NotFound;