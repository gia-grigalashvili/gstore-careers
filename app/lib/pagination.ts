const MAX_VISIBLE_PAGES = 7;

export type PageNumber = number | '...';

export function generatePageNumbers(
  currentPage: number,
  totalPages: number
): PageNumber[] {
  if (totalPages <= 0) return [1];
  if (totalPages <= MAX_VISIBLE_PAGES) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const pages: PageNumber[] = [1];
  const showLeftEllipsis = currentPage > 3;
  const showRightEllipsis = currentPage < totalPages - 2;

  if (showLeftEllipsis) pages.push('...');

  const start = Math.max(2, currentPage - 1);
  const end = Math.min(totalPages - 1, currentPage + 1);

  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  if (showRightEllipsis) pages.push('...');
  
  if (totalPages > 1) pages.push(totalPages);

  return pages;
}

export function calculatePaginationInfo(
  currentPage: number,
  totalPages: number,
  itemsPerPage: number,
  totalItems: number
) {
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);
  
  return {
    startItem,
    endItem,
    totalItems,
    isFirstPage: currentPage === 1,
    isLastPage: currentPage === totalPages,
  };
}