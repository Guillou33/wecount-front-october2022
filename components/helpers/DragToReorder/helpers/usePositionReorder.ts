import { useRef } from "react";

export type LayoutPosition = {
  top: number;
  height: number;
};

export function usePositionReorder<T>(
  order: T[],
  onOrderChange: (newOrder: T[]) => void
) {
  // We need to collect an array of height and position data for all of this component's
  // Item so we can us that in calculations to decide when a dragging Item should swap places
  // with its siblings.
  const positions = useRef<LayoutPosition[]>([]).current;

  const updateLayoutPosition = (i: number, position: LayoutPosition) => {
    positions[i] = position;
  };
  // Find the ideal index for a dragging item based on its position in the array, and its
  // current drag offset. If it's different to its current index, we swap this item with that
  // sibling.
  const updateOrder = (i: number, dragOffset: number): void => {
    const targetIndex = findIndex(i, dragOffset, positions);
    if (targetIndex !== i) {
      const copy = [...order];
      copy.splice(targetIndex, 0, copy.splice(i, 1)[0]);
      onOrderChange(copy);
    }
  };

  return { updateLayoutPosition, updateOrder };
}

function findIndex(
  i: number,
  yOffset: number,
  positions: LayoutPosition[]
): number {
  const { top, height } = positions[i];

  const previousItemSwapThreshold = getPreviousItemSwapThreshold(i, positions);
  const nextItemSwapThreshold = getNextItemSwapThreshold(i, positions);

  const currentItemTopOffset = yOffset + top;
  const currentItemBottomOffset = yOffset + top + height;

  if (currentItemTopOffset < previousItemSwapThreshold) {
    return i - 1;
  }

  if (currentItemBottomOffset > nextItemSwapThreshold) {
    return i + 1;
  }
  return i;
}

function getPreviousItemSwapThreshold(
  i: number,
  positions: LayoutPosition[]
): number {
  const previousItem = positions[i - 1];
  if (previousItem == null) {
    return -Infinity;
  }
  return previousItem.top;
}

function getNextItemSwapThreshold(
  i: number,
  positions: LayoutPosition[]
): number {
  const nextItem = positions[i + 1];
  if (nextItem == null) {
    return Infinity;
  }
  return nextItem.top + nextItem.height;
}
