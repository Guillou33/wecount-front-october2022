import { useRef, useReducer, useCallback } from "react";
import { usePositionReorder } from "./helpers/usePositionReorder";

import DraggableItem from "@components/helpers/DragToReorder/DraggableItem";

import styles from "@styles/helpers/dragToReorder.module.scss";
import { debounce } from "lodash";

interface Props<T> {
  itemsData: T[];
  renderItem: (itemData: T) => JSX.Element;
  onOrderChange: (newOrder: T[]) => void;
  onReorderFinished?: (newOrder: T[]) => void;
  keyProducer: (itemData: T) => string;
}

const DragToReorder = <T,>({
  itemsData,
  renderItem,
  onOrderChange,
  onReorderFinished,
  keyProducer,
}: Props<T>) => {
  const { updateLayoutPosition, updateOrder } = usePositionReorder(
    itemsData,
    onOrderChange
  );

  const [, forceUpdate] = useReducer(x => {
    return !x;
  }, false);

  const observer = useRef(
    // @ts-ignore
    new ResizeObserver(debounce(forceUpdate, 16))
  ).current;

  const ref = useCallback((node: HTMLOListElement) => {
    if (node != null) {
      observer.observe(node);
    } else {
      observer.disconnect();
    }
  }, []);

  return (
    <ol className={styles.dragToReorder} ref={ref}>
      {itemsData.map((itemData, i) => (
        <DraggableItem
          key={keyProducer(itemData)}
          index={i}
          updateLayoutPosition={updateLayoutPosition}
          updateOrder={updateOrder}
          onDragEnd={() => onReorderFinished && onReorderFinished(itemsData)}
        >
          {renderItem(itemData)}
        </DraggableItem>
      ))}
    </ol>
  );
};

export default DragToReorder;
