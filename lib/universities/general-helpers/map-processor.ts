export function sortMap(
  map: Map<any, number | number[]>,
  index: number = 0,
  isDesc: boolean = false
) {
  const sorted = [...map.entries()].sort((a, b) => {
    const aVal = Array.isArray(a[1]) ? a[1][index] ?? 0 : a[1];
    const bVal = Array.isArray(b[1]) ? b[1][index] ?? 0 : b[1];

    return isDesc ? aVal - bVal : bVal - aVal;
  });

  return new Map<any, number | number[]>(sorted);
}

export function getAvg(map: Map<any, number | number[]>, index: number = 0) {
  if (map.size === 0) return 0;

  let sum = 0;
  for (const value of map.values())
    sum += Array.isArray(value) ? value[index] ?? 0 : value;

  return sum / map.size;
}
