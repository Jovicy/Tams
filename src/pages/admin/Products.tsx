import { useEffect, useState } from "react";
import { LuPencil, LuTrash2, LuPlus, LuEye } from "react-icons/lu";

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
import Modal from "../../components/Modal";
import Preloader from "../../components/Preloader.tsx";
import { createProduct, deleteProduct, listProducts, updateProduct, type ApiProduct } from "../../api/products";
import { listCategories, type Category } from "../../api/categories";
import { notifyError, notifyResponse } from "../../lib/notification";

export default function AdminProducts() {
  const normalizePlanLabel = (plan: string) => {
    switch (plan.toLowerCase()) {
      case "installment":
        return "Installment";
      case "thrift":
        return "Thrift";
      default:
        return "Full";
    }
  };

  const defaultFormData: Partial<AdminProduct> = {
    name: "",
    description: "",
    price: 0,
    categoryId: undefined,
    weight: "",
    karat: "18K",
    plans: ["Full"],
    installmentDurations: [6],
  };

  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [viewingId, setViewingId] = useState<number | null>(null);
  const [deleteCandidate, setDeleteCandidate] = useState<AdminProduct | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const [formData, setFormData] = useState<Partial<AdminProduct>>(defaultFormData);

  const mapApiProductToAdminProduct = (product: ApiProduct): AdminProduct => ({
    id: product.id,
    name: product.name,
    slug: product.slug,
    description: product.description,
    price: product.price,
    categoryId: product.categoryId,
    category: (product.category?.name as string) ?? undefined,
    weight: product.weight,
    karat: product.karat,
    image: (product as any).image,
    imageUrl: product.imageUrl,
    plans: (product.plans ?? []).map(normalizePlanLabel),
    installmentDurations: (product.installmentDurations ?? []).filter((value): value is 3 | 6 => value === 3 || value === 6),
    isFeatured: product.isFeatured,
    isActive: product.isActive,
    createdAt: product.createdAt,
    updatedAt: product.updatedAt,
  });

  const refreshProducts = async (page = currentPage, size = pageSize) => {
    setIsLoadingProducts(true);

    try {
      const response = await listProducts({ page, pageSize: size });
      const nextProducts = (response.data.products ?? response.data.items ?? []).map(mapApiProductToAdminProduct);

      setProducts(nextProducts);
      setTotalProducts(response.data.pagination?.total ?? response.data.pagination?.totalItems ?? nextProducts.length);
      setTotalPages(response.data.pagination?.totalPages ?? 1);
    } catch {
      setProducts([]);
      setTotalProducts(0);
      setTotalPages(1);
    } finally {
      setIsLoadingProducts(false);
    }
  };

  const refreshCategories = async () => {
    try {
      const response = await listCategories({ skip: 0, take: 100 });
      setCategories(response.data.categories ?? response.data.items ?? []);
    } catch {
      setCategories([]);
    }
  };

  useEffect(() => {
    refreshProducts();
  }, [currentPage, pageSize]);

  useEffect(() => {
    refreshCategories();
  }, []);

  const handleCreate = async () => {
    if (!formData.name || !formData.price) return;
    if (!selectedFile) return;

    const selectedPlans = (formData.plans ?? ["Full"]).map((plan) => plan.toLowerCase() as "full" | "installment" | "thrift");
    const selectedDurations = (formData.installmentDurations ?? [6]).filter((value): value is 3 | 6 => value === 3 || value === 6).sort((a, b) => a - b);

    if (selectedPlans.includes("installment") && selectedDurations.length === 0) return;

    setIsSubmitting(true);

    try {
      const response = await createProduct({
        name: formData.name,
        description: formData.description || "",
        price: Number(formData.price),
        categoryId: Number(formData.categoryId),
        weight: formData.weight || "",
        karat: formData.karat || "18K",
        plans: selectedPlans,
        installmentDurations: selectedPlans.includes("installment") ? selectedDurations : [],
        isActive: formData.isActive ?? true,
        isFeatured: formData.isFeatured ?? false,
        file: selectedFile,
      });

      const nextProducts = [...products, mapApiProductToAdminProduct(response.data)];
      setProducts(nextProducts);
      notifyResponse({ status: response.status, message: response.message });
      setFormData(defaultFormData);
      setSelectedFile(null);
      setIsCreating(false);
    } catch (error) {
      notifyError(error, "Unable to create product.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdate = async () => {
    if (!editingId || !formData.name || !formData.price) return;

    const selectedPlans = (formData.plans ?? ["Full"]).map((plan) => plan.toLowerCase() as "full" | "installment" | "thrift");
    const selectedDurations = (formData.installmentDurations ?? [6]).filter((value): value is 3 | 6 => value === 3 || value === 6).sort((a, b) => a - b);

    if (selectedPlans.includes("installment") && selectedDurations.length === 0) return;

    setIsSubmitting(true);

    try {
      const response = await updateProduct(editingId, {
        name: formData.name,
        description: formData.description || "",
        price: Number(formData.price),
        categoryId: Number(formData.categoryId),
        weight: formData.weight || "",
        karat: formData.karat || "18K",
        plans: selectedPlans,
        installmentDurations: selectedPlans.includes("installment") ? selectedDurations : [],
        isActive: formData.isActive ?? true,
        isFeatured: formData.isFeatured ?? false,
        file: selectedFile || undefined,
      });

      const nextProduct = mapApiProductToAdminProduct(response.data);
      setProducts((current) => current.map((product) => (product.id === editingId ? nextProduct : product)));
      notifyResponse({ status: response.status, message: response.message });
      setEditingId(null);
      setFormData(defaultFormData);
      setSelectedFile(null);
    } catch (error) {
      notifyError(error, "Unable to update product.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteRequest = (product: AdminProduct) => {
    setDeleteCandidate(product);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteCandidate) return;

    setIsDeleting(true);

    try {
      const response = await deleteProduct(deleteCandidate.id);

      if (viewingId === deleteCandidate.id) {
        setViewingId(null);
      }

      setDeleteCandidate(null);
      notifyResponse({ status: response.status, message: response.message });

      if (currentPage > 1 && products.length === 1) {
        setCurrentPage((page) => page - 1);
        return;
      }

      await refreshProducts();
    } catch (error) {
      notifyError(error, "Unable to delete product.");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleEdit = (product: AdminProduct) => {
    setEditingId(product.id);
    setFormData({
      ...product,
      plans: (product.plans ?? ["Full"]).map(normalizePlanLabel),
      installmentDurations: product.installmentDurations && product.installmentDurations.length > 0 ? product.installmentDurations : [6],
    });
    setSelectedFile(null);
  };

  const togglePlan = (plan: "Full" | "Installment" | "Thrift") => {
    const currentPlans = formData.plans ?? ["Full"];
    const hasPlan = currentPlans.includes(plan);
    const nextPlans = hasPlan ? currentPlans.filter((item) => item !== plan) : [...currentPlans, plan];

    setFormData((current) => ({
      ...current,
      plans: nextPlans.length > 0 ? nextPlans : ["Full"],
      installmentDurations: (nextPlans.length > 0 ? nextPlans : ["Full"]).includes("Installment")
        ? current.installmentDurations && current.installmentDurations.length > 0
          ? current.installmentDurations
          : [6]
        : [],
    }));
  };

  const toggleInstallmentDuration = (duration: 3 | 6) => {
    const currentDurations = formData.installmentDurations ?? [];
    const hasDuration = currentDurations.includes(duration);
    const nextDurations = hasDuration ? currentDurations.filter((item) => item !== duration) : [...currentDurations, duration];

    setFormData((current) => ({
      ...current,
      installmentDurations: nextDurations.sort((a, b) => a - b),
    }));
  };

  const handleToggleStatus = (productId: number) => {
    setProducts((current) =>
      current.map((product) =>
        product.id === productId
          ? {
              ...product,
              isActive: !product.isActive,
              updatedAt: new Date().toISOString(),
            }
          : product,
      ),
    );
  };

  const viewingProduct = products.find((p) => p.id === viewingId);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="font-playfair text-3xl font-bold text-foreground">Products</h1>
          <p className="mt-1 text-sm text-muted-text">Manage {totalProducts} jewelry items in your catalog.</p>
        </div>

        <div className="flex items-center gap-3">
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

          <button onClick={() => setIsCreating(!isCreating)} className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-black transition hover:opacity-90">
            <LuPlus className="h-4 w-4" />
            Add product
          </button>
        </div>
      </div>

      {/* Create/Edit Modal */}
      <Modal
        isOpen={isCreating || !!editingId}
        title={editingId ? "Edit product" : "Create new product"}
        onClose={() => {
          setIsCreating(false);
          setEditingId(null);
          setFormData(defaultFormData);
        }}
        size="lg">
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Product name"
            value={formData.name || ""}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
          />

          <input
            type="number"
            placeholder="Price (₦)"
            value={formData.price || ""}
            onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
            className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
          />

          <input
            type="text"
            placeholder="Weight (e.g., 4.2g)"
            value={formData.weight || ""}
            onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
            className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
          />

          <select
            value={formData.karat || "18K"}
            onChange={(e) => setFormData({ ...formData, karat: e.target.value })}
            className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary">
            <option value="18K">18K Gold</option>
            <option value="22K">22K Gold</option>
            <option value="24K">24K Gold</option>
          </select>

          <select
            value={formData.categoryId ?? ""}
            onChange={(e) => setFormData({ ...formData, categoryId: Number(e.target.value) })}
            className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary">
            <option value="">Select category</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>

          <textarea
            placeholder="Description"
            value={formData.description || ""}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            rows={3}
          />

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Product image</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setSelectedFile(e.target.files?.[0] ?? null)}
              className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground file:mr-4 file:rounded-md file:border-0 file:bg-primary file:px-3 file:py-1.5 file:text-sm file:font-semibold file:text-black hover:file:opacity-90"
            />
            {!selectedFile && !editingId && <p className="text-xs text-muted-text">Upload an image before creating the product.</p>}
            {selectedFile && <p className="text-xs text-muted-text">Selected: {selectedFile.name}</p>}

            {!selectedFile && editingId && formData.imageUrl && (
              <div className="mt-3 flex items-center gap-3">
                <div className="h-24 w-24 overflow-hidden rounded-md border border-border">
                  <img src={formData.imageUrl} alt={formData.name ?? "product image"} className="h-full w-full object-cover" />
                </div>
                <div>
                  <p className="text-sm font-medium">Current image</p>
                  <p className="mt-1 text-xs text-muted-text">You can keep this image or choose a new file to replace it.</p>
                </div>
              </div>
            )}
          </div>

          <div className="rounded-lg border border-border/70 bg-background/50 p-4">
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-text">Available Payment Plans</p>
            <div className="mt-3 grid gap-2 md:grid-cols-3">
              {(["Full", "Installment", "Thrift"] as const).map((plan) => (
                <label key={plan} className="flex items-center gap-2 rounded-md border border-border px-3 py-2 text-sm text-foreground">
                  <input type="checkbox" checked={(formData.plans ?? ["Full"]).includes(plan)} onChange={() => togglePlan(plan)} className="h-4 w-4" />
                  {plan === "Thrift" ? "Flexible" : plan}
                </label>
              ))}
            </div>
          </div>

          {(formData.plans ?? ["Full"]).includes("Installment") && (
            <div className="rounded-lg border border-border/70 bg-background/50 p-4">
              <p className="text-xs font-semibold uppercase tracking-widest text-muted-text">Installment Durations</p>
              <p className="mt-1 text-xs text-muted-text">Select at least one duration.</p>
              <div className="mt-3 grid gap-2 md:grid-cols-2">
                {([3, 6] as const).map((duration) => (
                  <label key={duration} className="flex items-center gap-2 rounded-md border border-border px-3 py-2 text-sm text-foreground">
                    <input type="checkbox" checked={(formData.installmentDurations ?? []).includes(duration)} onChange={() => toggleInstallmentDuration(duration)} className="h-4 w-4" />
                    {duration} months
                  </label>
                ))}
              </div>
            </div>
          )}

          <div className="flex gap-2 border-t border-border/60 pt-6">
            <button
              onClick={editingId ? handleUpdate : handleCreate}
              disabled={!editingId && !selectedFile ? true : isSubmitting || !formData.categoryId}
              className="flex-1 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-black transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60">
              {isSubmitting ? (editingId ? "Updating..." : "Creating...") : editingId ? "Update product" : "Create product"}
            </button>
            <button
              onClick={() => {
                setIsCreating(false);
                setEditingId(null);
                setFormData(defaultFormData);
              }}
              className="flex-1 rounded-md border border-border px-4 py-2 text-sm font-semibold text-muted-text transition hover:border-primary hover:text-primary">
              Cancel
            </button>
          </div>
        </div>
      </Modal>

      {/* Products table */}
      {isLoadingProducts ? (
        <Preloader title="Loading products" message="Fetching catalog from the server..." />
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-border bg-card">
          <table className="w-full text-sm">
            <thead className="border-b border-border/60 bg-background">
              <tr>
                <th className="px-6 py-4 text-left font-medium text-muted-text">Name</th>
                <th className="px-6 py-4 text-left font-medium text-muted-text">Price</th>
                <th className="px-6 py-4 text-left font-medium text-muted-text">Weight</th>
                <th className="px-6 py-4 text-left font-medium text-muted-text">Status</th>
                <th className="px-6 py-4 text-right font-medium text-muted-text">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {products.map((product) => (
                <tr key={product.id} className="transition hover:bg-background/50">
                  <td className="px-6 py-4 font-medium text-foreground">{product.name}</td>
                  <td className="px-6 py-4 text-muted-text">₦{product.price.toLocaleString()}</td>
                  <td className="px-6 py-4 text-muted-text">{product.weight}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${product.isActive ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}`}>
                      {product.isActive ? "Active" : "Inactive"}
                    </span>
                    <button
                      onClick={() => handleToggleStatus(product.id)}
                      className="ml-2 inline-flex items-center rounded-md border border-border px-2 py-1 text-[11px] font-semibold text-muted-text transition hover:border-primary hover:text-primary">
                      Toggle
                    </button>
                  </td>
                  <td className="flex justify-end gap-2 px-6 py-4">
                    <button
                      onClick={() => setViewingId(product.id)}
                      className="inline-flex items-center gap-2 rounded-md border border-blue-500/30 px-3 py-2 text-xs text-blue-400 transition hover:bg-blue-500/10">
                      <LuEye className="h-4 w-4" />
                      View
                    </button>
                    <button
                      onClick={() => handleEdit(product)}
                      className="inline-flex items-center gap-2 rounded-md border border-border px-3 py-2 text-xs text-muted-text transition hover:border-primary hover:text-primary">
                      <LuPencil className="h-4 w-4" />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteRequest(product)}
                      className="inline-flex items-center gap-2 rounded-md border border-red-500/30 px-3 py-2 text-xs text-red-400 transition hover:bg-red-500/10">
                      <LuTrash2 className="h-4 w-4" />
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {!isLoadingProducts && totalPages > 1 && (
        <div className="flex flex-col gap-3 rounded-2xl border border-border bg-card px-4 py-4 md:flex-row md:items-center md:justify-between">
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
              .slice(Math.max(0, currentPage - 3), Math.min(totalPages, currentPage + 2))
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

      {/* View Modal */}
      <Modal isOpen={!!viewingId} title={viewingProduct?.name || "Product Details"} onClose={() => setViewingId(null)} size="lg">
        {viewingProduct && (
          <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-muted-text">Product ID</p>
                <p className="mt-2 text-lg font-semibold text-foreground">#{viewingProduct.id}</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-muted-text">Status</p>
                <p className="mt-2">
                  <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${viewingProduct.isActive ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}`}>
                    {viewingProduct.isActive ? "Active" : "Inactive"}
                  </span>
                </p>
              </div>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-muted-text">Description</p>
              <p className="mt-2 leading-relaxed text-foreground">{viewingProduct.description}</p>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-muted-text">Price</p>
                <p className="mt-2 text-xl font-bold text-primary">₦{viewingProduct.price.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-muted-text">Weight</p>
                <p className="mt-2 text-lg font-semibold text-foreground">{viewingProduct.weight}</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-muted-text">Karat</p>
                <p className="mt-2 text-lg font-semibold text-foreground">{viewingProduct.karat}</p>
              </div>
            </div>

            <div className="rounded-lg border border-border/70 bg-background/50 p-4">
              <p className="text-xs font-semibold uppercase tracking-widest text-muted-text">Payment Plans</p>
              <p className="mt-2 text-sm text-foreground">{(viewingProduct.plans ?? ["Full"]).join(", ")}</p>
              {(viewingProduct.plans ?? ["Full"]).includes("Installment") && (
                <p className="mt-1 text-xs text-muted-text">Durations: {(viewingProduct.installmentDurations ?? [6]).join(", ")} months</p>
              )}
            </div>

            <div className="flex gap-3 border-t border-border/60 pt-6">
              <button
                onClick={() => handleToggleStatus(viewingProduct.id)}
                className="flex-1 rounded-md border border-border px-4 py-2 text-sm font-semibold text-muted-text transition hover:border-primary hover:text-primary">
                {viewingProduct.isActive ? "Deactivate" : "Activate"}
              </button>
              <button
                onClick={() => {
                  setViewingId(null);
                  handleEdit(viewingProduct);
                }}
                className="flex-1 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-black transition hover:opacity-90">
                Edit Product
              </button>
              <button
                onClick={() => setViewingId(null)}
                className="flex-1 rounded-md border border-border px-4 py-2 text-sm font-semibold text-muted-text transition hover:border-primary hover:text-primary">
                Close
              </button>
            </div>
          </div>
        )}
      </Modal>

      <Modal
        isOpen={!!deleteCandidate}
        title="Delete product"
        onClose={() => {
          if (isDeleting) return;
          setDeleteCandidate(null);
        }}
        size="sm">
        {deleteCandidate && (
          <div className="space-y-5">
            <div className="flex items-start gap-3 rounded-lg border border-red-500/20 bg-red-500/10 p-4">
              <div className="rounded-full bg-red-500/15 p-2 text-red-400">
                <LuTrash2 className="h-5 w-5" />
              </div>
              <div>
                <p className="font-medium text-foreground">Remove {deleteCandidate.name}?</p>
                <p className="mt-1 text-sm leading-relaxed text-muted-text">This action will permanently delete the product from the catalog. It cannot be undone.</p>
              </div>
            </div>

            <div className="flex gap-3 border-t border-border/60 pt-5">
              <button
                onClick={() => setDeleteCandidate(null)}
                disabled={isDeleting}
                className="flex-1 rounded-md border border-border px-4 py-2 text-sm font-semibold text-muted-text transition hover:border-primary hover:text-primary disabled:cursor-not-allowed disabled:opacity-50">
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                disabled={isDeleting}
                className="flex-1 rounded-md bg-red-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-60">
                {isDeleting ? "Deleting..." : "Delete product"}
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
