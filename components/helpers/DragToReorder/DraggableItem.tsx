import { useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";
import cx from "classnames";

import { LayoutPosition } from "./helpers/usePositionReorder";

import styles from "@styles/helpers/dragToReorder.module.scss";

interface DraggableItemProps {
  index: number;
  updateLayoutPosition: (i: number, position: LayoutPosition) => void;
  updateOrder: (i: number, dragOffset: number) => void;
  onDragEnd: () => void;
  children: JSX.Element;
}

const DraggableItem = ({
  index,
  updateLayoutPosition,
  updateOrder,
  onDragEnd,
  children,
}: DraggableItemProps) => {
  const [isDragging, setDragging] = useState(false);

  const itemRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (itemRef.current != null) {
      updateLayoutPosition(index, {
        top: itemRef.current.offsetTop,
        height: itemRef.current.offsetHeight,
      });
    }
  });

  return (
    <li className={cx(styles.reorderableItem)}>
      <motion.div
        ref={itemRef}
        className={cx(styles.itemContainer, {
          [styles.dragging]: isDragging,
        })}
        layout="position"
        drag="y"
        onDragStart={() => setDragging(true)}
        onDragEnd={() => {
          setDragging(false);
          onDragEnd();
        }}
        onViewportBoxUpdate={(_, delta) => {
          if (isDragging) {
            updateOrder(index, delta.y.translate);
          }
        }}
      >
        {children}
      </motion.div>
    </li>
  );
};

export default DraggableItem;
