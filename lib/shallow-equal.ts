export function shallowEqualMomentIds(a: { id: string }[], b: { id: string }[]) {
  if (a.length !== b.length) return false;
  return a.every((item, i) => item.id === b[i]?.id);
}
