import { useEffect, useState } from "react";
import Modal from "../../components/Modal";
import PageShell from "../../components/PageShell";
import Preloader from "../../components/Preloader.tsx";
import { createCategory, deleteCategory, listCategories, updateCategory, type Category } from "../../api/categories";
import { notifyError, notifyResponse } from "../../lib/notification";

export default function AdminCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [deleteCandidate, setDeleteCandidate] = useState<Category | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [name, setName] = useState("");
  const [skip, setSkip] = useState(0);
  const [take, setTake] = useState(20);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  const loadCategories = async (nextSkip = skip, nextTake = take) => {
    setIsLoading(true);

    try {
      const response = await listCategories({ skip: nextSkip, take: nextTake });
      const nextCategories = response.data.categories ?? response.data.items ?? [];
      const nextPagination = response.data.pagination;

      setCategories(nextCategories);
      setTotalPages(nextPagination.totalPages || 1);
      setTotalItems(nextPagination.total ?? nextPagination.totalItems ?? nextCategories.length);
      setPage(nextPagination.page || 1);
      setSkip(nextPagination.skip ?? nextSkip);
      setTake(nextPagination.take ?? nextTake);
    } catch {
      setCategories([]);
      setTotalPages(1);
      setTotalItems(0);
      setPage(1);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, [skip, take]);

  const handleCreateCategory = async () => {
    const trimmedName = name.trim();
    if (!trimmedName) return;

    setIsSubmitting(true);

    try {
      const response = await createCategory({ name: trimmedName });
      notifyResponse({ status: response.status, message: response.message });
      setName("");
      setIsCreating(false);
      await loadCategories(0, take);
    } catch (error) {
      notifyError(error, "Unable to create category.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateCategory = async () => {
    const trimmedName = name.trim();
    if (!editingCategory || !trimmedName) return;

    setIsSubmitting(true);

    try {
      const response = await updateCategory(editingCategory.id, { name: trimmedName });
      notifyResponse({ status: response.status, message: response.message });
      setEditingCategory(null);
      setName("");
      await loadCategories(skip, take);
    } catch (error) {
      notifyError(error, "Unable to update category.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteCategory = async () => {
    if (!deleteCandidate) return;

    setIsDeleting(true);

    try {
      const response = await deleteCategory(deleteCandidate.id);
      notifyResponse({ status: response.status, message: response.message });
      setDeleteCandidate(null);
      await loadCategories(skip, take);
    } catch (error) {
      notifyError(error, "Unable to delete category.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <PageShell badge="Admin" title="Categories" description="Manage jewelry collections and product groupings.">
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <p className="text-sm text-muted-text">
          Showing {categories.length} of {totalItems} categories
        </p>

        <div className="flex flex-wrap items-center gap-3">
          <label className="flex items-center gap-2 text-sm text-muted-text">
            <span>Page size</span>
            <select
              value={take}
              onChange={(event) => {
                const nextTake = Number(event.target.value);
                setSkip(0);
                setTake(nextTake);
                loadCategories(0, nextTake);
              }}
              className="rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary">
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
          </label>

          <button onClick={() => setIsCreating(true)} className="inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-semibold text-black transition hover:opacity-90">
            Add category
          </button>
        </div>
      </div>

      {isLoading ? (
        <Preloader title="Loading categories" message="Fetching collections from the server..." />
      ) : categories.length === 0 ? (
        <div className="rounded-2xl border border-border bg-card p-8 text-center text-muted-text">No categories found.</div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {categories.map((category) => (
            <div key={category.id} className="rounded-2xl border border-border bg-card p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="font-semibold text-foreground">{category.name}</h2>
                  {category.description && <p className="mt-1 text-sm text-muted-text">{category.description}</p>}
                  {category.slug && <p className="mt-2 text-xs uppercase tracking-widest text-muted-text">{category.slug}</p>}
                  {typeof (category as Category & { productCount?: number }).productCount === "number" && (
                    <p className="mt-2 text-xs text-muted-text">{(category as Category & { productCount?: number }).productCount} products</p>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setEditingCategory(category);
                      setName(category.name);
                    }}
                    className="rounded-md border border-border px-3 py-2 text-xs font-semibold text-muted-text transition hover:border-primary hover:text-primary">
                    Edit
                  </button>
                  <button onClick={() => setDeleteCandidate(category)} className="rounded-md border border-red-500/30 px-3 py-2 text-xs font-semibold text-red-400 transition hover:bg-red-500/10">
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {!isLoading && totalPages > 1 && (
        <div className="mt-6 flex items-center justify-between gap-3 rounded-2xl border border-border bg-card px-4 py-4">
          <p className="text-sm text-muted-text">
            Page {page} of {totalPages}
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                const nextPage = Math.max(1, page - 1);
                const nextSkip = (nextPage - 1) * take;
                setSkip(nextSkip);
                loadCategories(nextSkip, take);
              }}
              disabled={page <= 1}
              className="rounded-md border border-border px-3 py-2 text-sm text-muted-text transition hover:border-primary hover:text-primary disabled:cursor-not-allowed disabled:opacity-50">
              Previous
            </button>
            <button
              onClick={() => {
                const nextPage = Math.min(totalPages, page + 1);
                const nextSkip = (nextPage - 1) * take;
                setSkip(nextSkip);
                loadCategories(nextSkip, take);
              }}
              disabled={page >= totalPages}
              className="rounded-md border border-border px-3 py-2 text-sm text-muted-text transition hover:border-primary hover:text-primary disabled:cursor-not-allowed disabled:opacity-50">
              Next
            </button>
          </div>
        </div>
      )}

      <Modal
        isOpen={isCreating || !!editingCategory}
        title={editingCategory ? "Edit category" : "Create category"}
        onClose={() => {
          if (isSubmitting) return;
          setIsCreating(false);
          setEditingCategory(null);
          setName("");
        }}
        size="sm">
        <div className="space-y-4">
          <div>
            <label className="mb-2 block text-sm font-medium text-foreground">Category name</label>
            <input
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="e.g. Rings"
              className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          <div className="flex gap-3 border-t border-border/60 pt-5">
            <button
              onClick={() => {
                setIsCreating(false);
                setEditingCategory(null);
                setName("");
              }}
              disabled={isSubmitting}
              className="flex-1 rounded-md border border-border px-4 py-2 text-sm font-semibold text-muted-text transition hover:border-primary hover:text-primary disabled:cursor-not-allowed disabled:opacity-50">
              Cancel
            </button>
            <button
              onClick={editingCategory ? handleUpdateCategory : handleCreateCategory}
              disabled={isSubmitting || !name.trim()}
              className="flex-1 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-black transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60">
              {isSubmitting ? (editingCategory ? "Updating..." : "Creating...") : editingCategory ? "Update category" : "Create category"}
            </button>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={!!deleteCandidate}
        title="Delete category"
        onClose={() => {
          if (isDeleting) return;
          setDeleteCandidate(null);
        }}
        size="sm">
        {deleteCandidate && (
          <div className="space-y-5">
            <div className="rounded-lg border border-red-500/20 bg-red-500/10 p-4">
              <p className="font-medium text-foreground">Delete {deleteCandidate.name}?</p>
              <p className="mt-1 text-sm leading-relaxed text-muted-text">This action permanently removes the category.</p>
            </div>

            <div className="flex gap-3 border-t border-border/60 pt-5">
              <button
                onClick={() => setDeleteCandidate(null)}
                disabled={isDeleting}
                className="flex-1 rounded-md border border-border px-4 py-2 text-sm font-semibold text-muted-text transition hover:border-primary hover:text-primary disabled:cursor-not-allowed disabled:opacity-50">
                Cancel
              </button>
              <button
                onClick={handleDeleteCategory}
                disabled={isDeleting}
                className="flex-1 rounded-md bg-red-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-60">
                {isDeleting ? "Deleting..." : "Delete category"}
              </button>
            </div>
          </div>
        )}
      </Modal>
    </PageShell>
  );
}
