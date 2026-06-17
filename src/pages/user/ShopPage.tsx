import { useEffect, useState } from "react";
import { LuSearch } from "react-icons/lu";
import { Link } from "react-router-dom";

interface AdminProduct {
  id: number;
  name: string;
  slug: string;
  description?: string | null;
  price: number;
  categoryId?: number | null;
  category?: string | undefined;
  weight?: string | null;
  karat?: string | null;
  image?: string | undefined;
  imageUrl?: string | undefined;
  plans?: string[];
  installmentDurations?: Array<3 | 6>;
  isFeatured: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}
import { listProducts, type ApiProduct } from "../../api/products.ts";
import { listCategories, type Category } from "../../api/categories.ts";
import Preloader from "../../components/Preloader.tsx";

const defaultPlansByProductId: Record<number, string[]> = {
  1: ["Full", "Installment", "Thrift"],
  2: ["Full", "Installment"],
  3: ["Full", "Installment", "Thrift"],
  4: ["Full", "Installment"],
};

export default function ShopPage() {
  const [activeCategoryId, setActiveCategoryId] = useState<number>(-1);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const mapApiProduct = (item: ApiProduct): AdminProduct => ({
    id: item.id,
    name: item.name,
    slug: item.slug,
    description: item.description,
    price: item.price,
    categoryId: item.categoryId,
    category: (item.category?.name as string) ?? undefined,
    weight: item.weight,
    karat: item.karat,
    image: (item as any).image,
    imageUrl: item.imageUrl,
    plans: item.plans ?? [],
    installmentDurations: (item.installmentDurations ?? []).filter((value): value is 3 | 6 => value === 3 || value === 6),
    isFeatured: item.isFeatured,
    isActive: item.isActive,
    createdAt: item.createdAt,
    updatedAt: item.updatedAt,
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);

    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    const loadShopData = async () => {
      setIsLoading(true);
      const [productsResult, categoriesResult] = await Promise.allSettled([listProducts({ page: currentPage, pageSize, categoryId: activeCategoryId, search: debouncedSearch }), listCategories()]);

      if (productsResult.status === "fulfilled") {
        const apiProducts = (productsResult.value.data.products ?? productsResult.value.data.items ?? []).map(mapApiProduct);
        setTotalPages(productsResult.value.data.pagination?.totalPages ?? productsResult.value.data.pagination?.totalPages ?? apiProducts.length);
        setProducts(apiProducts);
      } else {
        setProducts([]);
      }

      if (categoriesResult.status === "fulfilled") {
        const apiCategories = categoriesResult.value.data.categories ?? categoriesResult.value.data.items ?? [];

        setCategories(apiCategories);
      } else {
        setCategories([]);
      }

      setIsLoading(false);
    };

    loadShopData();
  }, [currentPage, pageSize, activeCategoryId, debouncedSearch]);

  const derivedCategoryTabs = Array.from(
    new Map(
      products
        .filter((item) => item.categoryId !== undefined && item.categoryId !== null)
        .map((item) => [String(item.categoryId), { id: String(item.categoryId), label: item.category ?? `Category ${item.categoryId}` }]),
    ).values(),
  );

  const categoryTabs = [{ id: -1, label: "All Pieces" }, ...(categories.length > 0 ? categories.map((category) => ({ id: String(category.id), label: category.name })) : derivedCategoryTabs)];

  return (
    <div className="container mx-auto px-4 py-12">
      {/* HEADER */}
      <section className="mb-12 text-center max-w-2xl mx-auto">
        <h1 className="font-playfair text-4xl md:text-5xl font-bold mb-4">The Collection</h1>
        <p className="text-muted-text">Explore our curated selection of fine 18k and 22k gold jewelry.</p>
      </section>

      {/* PAGINATION + SEARCH */}
      <div className="flex items-end md:items-center gap-3 justify-between pb-3 flex-col md:flex-row">
        {/* Search */}
        <div className="relative w-full md:w-64">
          <LuSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search collection..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-full bg-card border border-border outline-none"
          />
        </div>
        <label className="flex items-center gap-2 text-sm text-muted-text">
          <span>Page size</span>
          <select
            value={pageSize}
            onChange={(event) => {
              setCurrentPage(1);
              setPageSize(Number(event.target.value));
            }}
            className="rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary">
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>
        </label>
      </div>

      {/* FILTER  */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
        {/* Categories */}
        <div className="flex overflow-x-auto pb-2 -mx-4 px-4 md:mx-0 md:px-0 md:pb-0 w-full md:w-auto hide-scrollbar gap-2">
          {categoryTabs.map((category) => (
            <button
              key={String(category.id)}
              onClick={() => setActiveCategoryId(category.id ? Number(category.id) : -1)}
              className={`
                                inline-flex items-center justify-center
                                px-4 py-2 rounded-full text-sm font-medium
                                transition-all duration-200

                                whitespace-nowrap

                                focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring
                                disabled:pointer-events-none disabled:opacity-50

                                border border-white/20

                                ${(activeCategoryId === -1 ? -1 : String(activeCategoryId)) === String(category.id) ? "bg-primary text-black border-primary" : "text-muted-foreground hover:text-white hover:border-primary hover:bg-accent"}
                            `}>
              {category.label}
            </button>
          ))}
        </div>
      </div>

      {/* PRODUCTS GRID */}
      {isLoading ? (
        <Preloader title="Loading products" message="Fetching collection from the server..." />
      ) : products.length === 0 ? (
        <div className="rounded-2xl border border-border bg-card p-10 text-center">
          <p className="text-sm text-muted-text">No products match your selected category and search.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-10">
          {products.map((item) => (
            <Link to={`/product/${item.id}`} key={item.id} className={`group flex flex-col ${item.isActive ? "" : "opacity-70"}`}>
              {/* Image as background */}
              <div className="relative aspect-4/5 rounded-xl overflow-hidden mb-4 border border-border">
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                  style={{
                    backgroundImage: `url(${item.image ?? item.imageUrl})`,
                  }}
                />

                <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>

              {/* Content */}
              <div className="flex flex-col flex-1">
                <h3 className="font-playfair font-semibold text-lg line-clamp-1 group-hover:text-primary transition-colors mb-1">{item.name}</h3>

                <div className="mb-2">
                  <span className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold ${item.isActive ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}`}>
                    {item.isActive ? "Available" : "Inactive"}
                  </span>
                </div>

                <p className="text-xl font-playfair font-medium text-foreground mb-3">₦{item.price.toLocaleString()}</p>

                <div className="flex gap-2 flex-wrap mt-auto capitalize">
                  {(item.plans ?? defaultPlansByProductId[item.id] ?? []).map((plan: string, index: number) => (
                    <span key={index} className="text-xs px-2.5 py-1 border border-border rounded-md text-muted-foreground">
                      {plan}
                    </span>
                  ))}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {!isLoading && totalPages > 1 && (
        <div className="flex flex-col gap-3 rounded-2xl border border-border bg-card px-4 py-4 mt-4 md:flex-row md:items-center md:justify-between">
          <p className="text-sm text-muted-text">
            Page {currentPage} of {totalPages}
          </p>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((current) => Math.max(1, current - 1))}
              disabled={currentPage <= 1}
              className="rounded-md border border-border px-3 py-2 text-sm text-muted-text transition hover:border-primary hover:text-primary disabled:cursor-not-allowed disabled:opacity-50">
              Previous
            </button>

            {Array.from({ length: totalPages }, (_, index) => index + 1)
              .slice(Math.max(0, currentPage - 2), Math.min(totalPages, currentPage + 2))
              .map((pageNumber) => (
                <button
                  key={pageNumber}
                  onClick={() => setCurrentPage(pageNumber)}
                  className={`rounded-md px-3 py-2 text-sm transition ${pageNumber === currentPage ? "bg-primary text-black" : "border border-border text-muted-text hover:border-primary hover:text-primary"}`}>
                  {pageNumber}
                </button>
              ))}

            <button
              onClick={() => setCurrentPage((current) => Math.min(totalPages, current + 1))}
              disabled={currentPage >= totalPages}
              className="rounded-md border border-border px-3 py-2 text-sm text-muted-text transition hover:border-primary hover:text-primary disabled:cursor-not-allowed disabled:opacity-50">
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
