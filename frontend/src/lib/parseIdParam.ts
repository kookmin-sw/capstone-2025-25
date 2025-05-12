export const parseIdParam = (id: string | undefined): number => {
  if (!id) return 0;
  const parsed = Number(id);
  return isNaN(parsed) ? 0 : parsed;
};
