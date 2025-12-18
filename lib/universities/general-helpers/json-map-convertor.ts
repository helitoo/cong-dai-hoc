export function jsonToMap(json: Record<any, any>): Map<any, any> {
  return new Map(Object.entries(json));
}

export function mapToJson(map: Map<any, any>): Record<any, any> {
  return Object.fromEntries(map);
}
