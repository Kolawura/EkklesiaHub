import { motion } from "framer-motion";

const Loader = ({ message = "Loading..." }: { message?: string }) => {
  return (
    <motion.div
      className="flex flex-col items-center gap-3 text-gray-500"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      <p className="text-sm">{message}</p>
    </motion.div>
  );
};

export default Loader;
