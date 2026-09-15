import { useEffect, useState } from "react";

const DEFAULT_ITEMS_PER_PAGE = 5;

/**
 * Paginates an array and keeps the current page in bounds as the
 * underlying list changes (e.g. after a filter or a removal).
 */
export function usePagedList(items, itemsPerPage = DEFAULT_ITEMS_PER_PAGE) {
  const [page, setPage] = useState(1);
  const totalPages = Math.max(1, Math.ceil(items.length / itemsPerPage));

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [totalPages, page]);

  const paginated = items.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  return {
    page,
    setPage,
    totalPages,
    paginated,
    goToPrevious: () => setPage((p) => Math.max(p - 1, 1)),
    goToNext: () => setPage((p) => Math.min(p + 1, totalPages)),
  };
}
