export const parseIdParam = (id: string | undefined): number | null => {
  if (!id) return null;
  const parsed = Number(id);
  return isNaN(parsed) ? null : parsed;
};
