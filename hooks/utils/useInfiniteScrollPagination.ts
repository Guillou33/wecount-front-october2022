import { useState, useRef, useEffect } from "react";
import { MutableRefObject } from "react";
import useBottomReached from "./useBottomReached";

const PAGE_LENGTH = 10;

type Options = {
  root?: MutableRefObject<Element | null>;
};

function useInfiniteScrollPagination<List>(
  list: List[],
  { root }: Options = {}
) {
  const [currentPage, setCurrentPage] = useState(1);
  const containerRef = useRef<any>(null);
  const listLength = useRef(list.length);

  useEffect(() => {
    listLength.current = list.length;
  }, [list.length]);

  useBottomReached({
    containerRef,
    onBottomReached: () => {
      setCurrentPage(page => {
        if (page * PAGE_LENGTH <= listLength.current) {
          return page + 1;
        }
        return page;
      });
    },
    root,
  });

  return { containerRef, listSize: currentPage * PAGE_LENGTH };
}

export default useInfiniteScrollPagination;
