export function calculateOffset(page: number, limit: number): number {
  return (page - 1) * limit;
}

export function validatePagination(page: number, limit: number): boolean {
  return page > 0 && limit > 0 && limit <= 100;
}