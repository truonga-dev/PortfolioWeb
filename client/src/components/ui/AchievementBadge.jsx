import { motion } from 'framer-motion';

const AchievementBadge = ({ title, icon, unlocked }) => {
  return (
    <motion.div
      className={`p-4 rounded-2xl text-center ${unlocked ? 'bg-primary-500/20' : 'bg-white/5 opacity-50'}`}
      whileHover={unlocked ? { scale: 1.1 } : {}}
    >
      <div className="text-3xl mb-2">{icon}</div>
      <p className="text-sm font-medium">{title}</p>
    </motion.div>
  );
};

export default AchievementBadge;