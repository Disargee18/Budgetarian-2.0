export const blobFloat = {
  animate: {
    y: [0, -20, 0],
    rotate: [0, 2, 0],
    transition: {
      duration: 8,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};

export const blobFloatAlt = {
  animate: {
    y: [0, -15, 0],
    rotate: [0, -2, 0],
    transition: {
      duration: 10,
      repeat: Infinity,
      ease: "easeInOut",
      delay: 2,
    },
  },
};

export const blobFloatSlow = {
  animate: {
    y: [0, -30, 0],
    rotate: [0, 5, 0],
    transition: {
      duration: 12,
      repeat: Infinity,
      ease: "easeInOut",
      delay: 4,
    },
  },
};

export const cardFloat = {
  rest: { y: 0, boxShadow: "var(--shadow-clayCard)" },
  hover: {
    y: -8,
    boxShadow: "var(--shadow-clayButtonHover)",
    transition: { duration: 0.4, ease: "easeOut" },
  },
};

export const clayButton = {
  rest: { scale: 1, y: 0 },
  hover: {
    y: -4,
    transition: { duration: 0.2, ease: "easeOut" },
  },
  tap: {
    scale: 0.92,
    y: 0,
    transition: { duration: 0.1, ease: "easeIn" },
  },
};

export const breathe = {
  animate: {
    scale: [1, 1.02, 1],
    transition: {
      duration: 6,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};

export const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

export const staggerContainer = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

export const slideUp = {
  hidden: { y: "100%", opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.35, ease: [0.32, 0.72, 0, 1] },
  },
  exit: {
    y: "100%",
    opacity: 0,
    transition: { duration: 0.25, ease: "easeIn" },
  },
};

export const scaleIn = {
  hidden: { scale: 0.8, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: { duration: 0.3, ease: [0.34, 1.56, 0.64, 1] },
  },
};

export const checkMark = {
  hidden: { pathLength: 0, opacity: 0 },
  visible: {
    pathLength: 1,
    opacity: 1,
    transition: { duration: 0.3, ease: "easeOut" },
  },
};

export const pageTransition = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: "easeOut" },
  },
  exit: {
    opacity: 0,
    y: -16,
    transition: { duration: 0.25, ease: "easeIn" },
  },
};
