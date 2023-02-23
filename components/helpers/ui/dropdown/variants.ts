import { Variants } from "framer-motion";

export const dropDownVariants: Variants = {
  opened: {
    scale: 1,
    opacity: 1,
  },
  closed: {
    scale: [1, 1.1, 0.9],
    opacity: [1, 0, 0],

    transition: {
      duration: 0.3,
      times: [0, 1, 1],
    },
  },
  initial: (centered: boolean) => ({
    scale: 0.9,
    opacity: 0,
    x: centered ? "-50%" : 0,
  }),
};
