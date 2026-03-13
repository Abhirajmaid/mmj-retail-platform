export function isAuthenticated(): boolean {
  if (typeof window !== "undefined") {
    return Boolean(localStorage.getItem("jewellery-retail-auth"));
  }
  return false;
}