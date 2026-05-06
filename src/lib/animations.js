export const blobFloat = {
  animate: {
    y: [0, -40, 0],
    x: [0, 20, 0],
    scale: [1, 1.1, 1],
    transition: {
      duration: 15,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};

export const blobFloatAlt = {
  animate: {
    y: [0, 40, 0],
    x: [0, -20, 0],
    scale: [1.1, 1, 1.1],
    transition: {
      duration: 18,
      repeat: Infinity,
      ease: "easeInOut",
      delay: 2,
    },
  },
};

export const blobFloatSlow = {
  animate: {
    y: [0, -20, 0],
    scale: [1, 1.05, 1],
    transition: {
      duration: 12,
      repeat: Infinity,
      ease: "easeInOut",
      delay: 4,
    },
  },
};

export const premiumCard = {
  rest: { 
    y: 0, 
    scale: 1,
    boxShadow: "0 8px 32px 0 rgba(0, 0, 0, 0.4)",
    borderColor: "rgba(255, 255, 255, 0.08)"
  },
  hover: {
    y: -8,
    scale: 1.01,
    boxShadow: "0 20px 40px 0 rgba(0, 0, 0, 0.6)",
    borderColor: "rgba(16, 185, 129, 0.3)",
    transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] },
  },
};

export const premiumButton = {
  rest: { scale: 1, filter: "brightness(1)" },
  hover: {
    scale: 1.02,
    filter: "brightness(1.1)",
    boxShadow: "0 0 20px rgba(16, 185, 129, 0.3)",
    transition: { duration: 0.2, ease: "easeOut" },
  },
  tap: {
    scale: 0.95,
    transition: { duration: 0.1, ease: "easeIn" },
  },
};

export const glow = {
  animate: {
    opacity: [0.4, 0.8, 0.4],
    transition: {
      duration: 4,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};

export const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
};

export const staggerContainer = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
    },
  },
};

export const slideUp = {
  hidden: { y: 100, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  },
  exit: {
    y: 50,
    opacity: 0,
    transition: { duration: 0.3, ease: "easeIn" },
  },
};

export const scaleIn = {
  hidden: { scale: 0.95, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] },
  },
};

export const checkMark = {
  hidden: { pathLength: 0, opacity: 0 },
  visible: {
    pathLength: 1,
    opacity: 1,
    transition: { duration: 0.4, ease: "easeOut" },
  },
};

export const pageTransition = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.5, ease: "easeOut" },
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.3, ease: "easeIn" },
  },
};
export const breathe = {
  animate: {
    scale: [1, 1.05, 1],
    opacity: [0.8, 1, 0.8],
    transition: {
      duration: 4,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};
