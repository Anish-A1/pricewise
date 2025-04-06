export async function fetchProducts(): Promise<any[]> {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "";
  
    const res = await fetch(`${baseUrl}/api/products`, {
      cache: "no-store",
    });
  
    if (!res.ok) throw new Error("Failed to fetch products");
  
    return res.json();
  }
  