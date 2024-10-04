import { useState, useEffect, useRef } from 'react';

export function useInfiniteScroll<T>(
  initialItems: T[],
  getMoreItems: (page: number) => Promise<T[]>
) {
  const [items, setItems] = useState(initialItems);
  const [page, setPage] = useState(0);
  const [hasNext, setHasNext] = useState(true);
  const trigger = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!hasNext) return;

    const observer = new IntersectionObserver(
      async (entries) => {
        const element = entries[0];
        if (element.isIntersecting && trigger.current) {
          observer.unobserve(trigger.current);
          const newItems = await getMoreItems(page + 1);
          if (newItems.length === 0) {
            setHasNext(false);
          } else {
            setItems((prev) => [...prev, ...newItems]);
            setPage((prev) => prev + 1);
          }
        }
      },
      { threshold: 0.5, rootMargin: '0px 0px 74px 0px' }
    );

    if (trigger.current) {
      observer.observe(trigger.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [page, getMoreItems]);

  return { items, trigger, hasNext };
}
