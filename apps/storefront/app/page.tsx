"use client";

import { Button, Card, CardBody, CardTitle, CardFooter, Badge, Container, Section } from "@jewellery-retail/ui";
import { appConfig } from "@jewellery-retail/config";
import { formatCurrency } from "@jewellery-retail/utils";
import { useLocalStorage } from "@jewellery-retail/hooks";

const products = [
  { id: 1, name: "Diamond Solitaire Ring", price: 1299.99, category: "Rings", stock: "In Stock" },
  { id: 2, name: "Pearl Drop Earrings", price: 249.99, category: "Earrings", stock: "In Stock" },
  { id: 3, name: "Gold Chain Necklace", price: 599.99, category: "Necklaces", stock: "Low Stock" },
];

export default function StorefrontPage() {
  const [cart, setCart] = useLocalStorage<number[]>("storefront-cart", []);

  const addToCart = (id: number) => setCart([...cart, id]);
  const cartCount = cart.length;

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      {/* Nav */}
      <header className="border-b border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
        <Container>
          <div className="flex h-16 items-center justify-between">
            <span className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
              {appConfig.appName}
            </span>
            <div className="flex items-center gap-4">
              <span className="text-sm text-zinc-500 dark:text-zinc-400">
                Cart ({cartCount})
              </span>
              <Button variant="outline" size="sm" onClick={() => setCart([])}>
                Clear
              </Button>
            </div>
          </div>
        </Container>
      </header>

      {/* Hero */}
      <Section spacing="xl" className="bg-white dark:bg-zinc-900">
        <Container>
          <div className="mx-auto max-w-2xl text-center">
            <Badge variant="info" className="mb-4">New Collection 2026</Badge>
            <h1 className="mb-6 text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 sm:text-5xl">
              Timeless Jewellery, Crafted with Precision
            </h1>
            <p className="mb-8 text-lg text-zinc-600 dark:text-zinc-400">
              Explore our curated collection of fine jewellery — from classic diamonds to modern gold pieces.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
              <Button size="lg">Shop Now</Button>
              <Button size="lg" variant="outline">View Lookbook</Button>
            </div>
          </div>
        </Container>
      </Section>

      {/* Products */}
      <Section spacing="lg">
        <Container>
          <h2 className="mb-8 text-2xl font-semibold text-zinc-900 dark:text-zinc-100">
            Featured Products
          </h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => (
              <Card key={product.id} className="flex flex-col">
                <div className="mb-4 flex h-48 items-center justify-center rounded-lg bg-zinc-100 dark:bg-zinc-800">
                  <span className="text-4xl">💎</span>
                </div>
                <div className="flex flex-1 flex-col">
                  <div className="mb-1 flex items-center gap-2">
                    <Badge variant="default">{product.category}</Badge>
                    <Badge variant={product.stock === "In Stock" ? "success" : "warning"}>
                      {product.stock}
                    </Badge>
                  </div>
                  <CardTitle className="mt-2">{product.name}</CardTitle>
                  <CardBody className="mt-1 text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                    {formatCurrency(product.price)}
                  </CardBody>
                  <CardFooter>
                    <Button
                      className="w-full"
                      onClick={() => addToCart(product.id)}
                    >
                      Add to Cart
                    </Button>
                  </CardFooter>
                </div>
              </Card>
            ))}
          </div>
        </Container>
      </Section>

      {/* CTA */}
      <Section spacing="lg" className="bg-zinc-900 dark:bg-zinc-800">
        <Container>
          <div className="mx-auto max-w-xl text-center">
            <h2 className="mb-4 text-2xl font-bold text-white">
              Bespoke Jewellery — Made for You
            </h2>
            <p className="mb-6 text-zinc-400">
              Work with our master craftspeople to create a one-of-a-kind piece.
            </p>
            <Button variant="secondary" size="lg">
              Book a Consultation
            </Button>
          </div>
        </Container>
      </Section>
    </div>
  );
}
