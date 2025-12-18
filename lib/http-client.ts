export default async function fetchWrapper<T>(
  method: "GET" | "POST" | "PUT" | "DELETE",
  pathname: string,
  body: Object | undefined = undefined
): Promise<T> {
  // Complete URL
  const baseUrl = process.env.NEXT_PUBLIC_API_ENDPOINT;
  const fullUrl = pathname.startsWith("/")
    ? `${baseUrl}${pathname}`
    : `${baseUrl}/${pathname}`;

  // Main processing
  const res = await fetch(fullUrl, {
    method,
    headers: {
      "Content-Type": "application/json",
    },
    body: body ? JSON.stringify(body) : undefined,
    credentials: "include",
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData?.message || `HTTP error: ${res.status}`);
  }

  return (await res.json()) as T;
}
