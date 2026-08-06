export function formatId(
  id: string | number | undefined | null
): string {
  if (id == null) return "";

  const str = String(id);

  let hash = 0;

  for (let i = 0; i < str.length; i++) {
    hash = (hash * 31 + str.charCodeAt(i)) >>> 0;
  }

  return hash.toString(36).toUpperCase().slice(0, 6);
}