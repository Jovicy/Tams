import { useEffect, useState } from "react";
import { LuCheck, LuX, LuTriangleAlert, LuLock, LuLockOpen, LuEye, LuTrash } from "react-icons/lu";

interface AdminUser {
  id: number;
  fullName: string;
  email: string;
  phone?: string;
  role: "customer" | "admin" | "super_admin" | string;
  isEmailVerified: boolean;
  isKycVerified: boolean;
  isSubmittedKYC: boolean;
  isSuspended: boolean;
  kycDocType?: string | null;
  kycDocNumber?: string | null;
  kycDocUrl?: string | null;
  createdAt: string;
  updatedAt: string;
}
import Modal from "../../components/Modal";
import Preloader from "../../components/Preloader.tsx";
import { listAdminUsers, suspendAdminUser, deleteAdminUser, getKycRecord, approveKyc, rejectKyc, type User, type KycRecord } from "../../api/users";
import { notifyError, notifyResponse } from "../../lib/notification";

export default function AdminUsers() {
  const formatDateTime = (value?: string) => {
    if (!value) return "N/A";

    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) return "N/A";

    return parsed.toLocaleString();
  };

  const formatDocumentType = (value?: string | null) => {
    if (!value) return "N/A";

    return value.replace(/[_-]+/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
  };

  const [users, setUsers] = useState<AdminUser[]>([]);
  const [filter, setFilter] = useState<"all" | "pending_kyc" | "suspended">("all");
  const [viewingId, setViewingId] = useState<number | null>(null);
  const [kycId, setKycId] = useState<number | null>(null);
  const [kycRecord, setKycRecord] = useState<KycRecord | null>(null);
  const [kycLoading, setKycLoading] = useState(false);
  const [kycActionLoading, setKycActionLoading] = useState(false);
  const [reviewerNote, setReviewerNote] = useState<string>("");
  const [rejectReason, setRejectReason] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [loadingIds, setLoadingIds] = useState<number[]>([]);
  const [skip, setSkip] = useState(0);
  const [take, setTake] = useState(20);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);

  const normalizeRole = (role: User["role"]): AdminUser["role"] => {
    const normalized = String(role).toLowerCase();

    if (normalized === "super_admin") return "super_admin";
    if (normalized === "admin") return "admin";
    return "customer";
  };

  const mapUser = (user: User): AdminUser => ({
    id: user.id,
    fullName: user.fullName,
    email: user.email,
    phone: user.phone,
    role: normalizeRole(user.role),
    isEmailVerified: user.isEmailVerified,
    isKycVerified: user.isKycVerified,
    isSubmittedKYC: user.isSubmittedKYC,
    isSuspended: user.isSuspended,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  });

  const loadUsers = async (nextSkip = skip, nextTake = take) => {
    setIsLoading(true);

    try {
      const response = await listAdminUsers({ skip: nextSkip, take: nextTake });
      const originalList = response.data.users ?? response.data.items ?? [];
      const mapped = originalList.map(mapUser);

      const filtered = mapped.filter((u) => u.role !== "super_admin");

      const originalTotal = response.data.pagination.total ?? response.data.pagination.totalItems ?? originalList.length;
      const superCountOnPage = mapped.length - filtered.length;

      setUsers(filtered);
      setTotalUsers(Math.max(0, originalTotal - superCountOnPage));
      setTotalPages(response.data.pagination.totalPages || 1);
      setPage(response.data.pagination.page || 1);
      setSkip(response.data.pagination.skip ?? nextSkip);
      setTake(response.data.pagination.take ?? nextTake);
    } catch {
      setUsers([]);
      setTotalUsers(0);
      setTotalPages(1);
      setPage(1);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, [skip, take]);

  const openKycModal = async (id: number) => {
    setKycId(id);
    setKycRecord(null);
    setKycLoading(true);
    try {
      const res = await getKycRecord(id);

      setKycRecord(res.data);
    } catch (err) {
      console.error("Failed to load KYC record:", err);
      notifyError(err, "Failed to load KYC record. Please try again.");
      setKycId(null);
    } finally {
      setKycLoading(false);
    }
  };

  const closeKycModal = () => {
    setKycId(null);
    setKycRecord(null);
    setKycLoading(false);
    setKycActionLoading(false);
    setReviewerNote("");
    setRejectReason("");
  };

  const handleApproveKyc = async (id: number) => {
    if (kycActionLoading) return;
    setKycActionLoading(true);
    try {
      const res = await approveKyc(id, reviewerNote || undefined);
      notifyResponse((res as any) ?? { message: "KYC approved." }, "KYC approved.");
      // refresh users list
      await loadUsers(skip, take);
      closeKycModal();
    } catch (err) {
      console.error(err);
      notifyError(err, "Failed to approve KYC. Please try again.");
    } finally {
      setKycActionLoading(false);
    }
  };

  const handleRejectKyc = async (id: number) => {
    if (kycActionLoading) return;
    if (!window.confirm("Are you sure you want to reject this KYC submission?")) return;
    setKycActionLoading(true);
    try {
      const res = await rejectKyc(id, rejectReason || undefined, reviewerNote || undefined);
      notifyResponse((res as any) ?? { message: "KYC rejected." }, "KYC rejected.");
      await loadUsers(skip, take);
      closeKycModal();
    } catch (err) {
      console.error(err);
      notifyError(err, "Failed to reject KYC. Please try again.");
    } finally {
      setKycActionLoading(false);
    }
  };

  const handleSuspend = async (userId: number, currentlySuspended: boolean) => {
    if (loadingIds.includes(userId)) return;
    setLoadingIds((s) => [...s, userId]);

    try {
      const res = await suspendAdminUser(userId, !currentlySuspended);
      notifyResponse((res as any) ?? { message: "User status updated." }, "User status updated.");
      // reload list to get authoritative state
      await loadUsers(skip, take);
    } catch (err) {
      console.error(err);
      notifyError(err, "Failed to update user status. Please try again.");
    } finally {
      setLoadingIds((s) => s.filter((i) => i !== userId));
    }
  };

  const handleDelete = async (userId: number) => {
    if (!window.confirm("Delete this user? This action cannot be undone.")) return;
    if (loadingIds.includes(userId)) return;
    setLoadingIds((s) => [...s, userId]);

    try {
      const res = await deleteAdminUser(userId);
      notifyResponse((res as any) ?? { message: "User deleted." }, "User deleted.");
      // remove from list locally to be responsive
      setUsers((current) => current.filter((u) => u.id !== userId));
      setTotalUsers((t) => Math.max(0, t - 1));
    } catch (err) {
      console.error(err);
      notifyError(err, "Failed to delete user. Please try again.");
    } finally {
      setLoadingIds((s) => s.filter((i) => i !== userId));
    }
  };

  const filteredUsers = users.filter((u) => {
    if (filter === "pending_kyc") return u.isSubmittedKYC && !u.isKycVerified && !u.isSuspended;
    if (filter === "suspended") return u.isSuspended;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-playfair text-3xl font-bold text-foreground">Users</h1>
        <p className="mt-1 text-sm text-muted-text">Manage {totalUsers} customer and staff accounts.</p>
      </div>

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        {/* Filters */}
        <div className="flex flex-wrap gap-2">
          {[
            { label: "All", value: "all" as const },
            { label: "Pending KYC", value: "pending_kyc" as const },
            { label: "Suspended", value: "suspended" as const },
          ].map(({ label, value }) => (
            <button
              key={value}
              onClick={() => setFilter(value)}
              className={`rounded-full border px-4 py-2 text-sm transition ${
                filter === value ? "border-primary bg-primary text-black" : "border-border text-muted-text hover:border-primary hover:text-primary"
              }`}>
              {label}
            </button>
          ))}
        </div>

        <label className="flex items-center gap-2 text-sm text-muted-text">
          <span>Page size</span>
          <select
            value={take}
            onChange={(event) => {
              const nextTake = Number(event.target.value);
              setSkip(0);
              setTake(nextTake);
              loadUsers(0, nextTake);
            }}
            className="rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary">
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>
        </label>
      </div>

      {/* Users table */}
      {isLoading ? (
        <Preloader title="Loading users" message="Fetching accounts from the server..." />
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-border bg-card">
          <table className="w-full text-sm">
            <thead className="border-b border-border/60 bg-background">
              <tr>
                <th className="px-6 py-4 text-left font-medium text-muted-text">Name</th>
                <th className="px-6 py-4 text-left font-medium text-muted-text">Email</th>
                <th className="px-6 py-4 text-left font-medium text-muted-text">Role</th>
                <th className="px-6 py-4 text-left font-medium text-muted-text">Email Verified</th>
                <th className="px-6 py-4 text-left font-medium text-muted-text">KYC</th>
                <th className="px-6 py-4 text-left font-medium text-muted-text">Status</th>
                <th className="px-6 py-4 text-right font-medium text-muted-text">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="transition hover:bg-background/50">
                  <td className="px-6 py-4 font-medium text-foreground">{user.fullName}</td>
                  <td className="px-6 py-4 text-muted-text text-xs">{user.email}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${user.role === "admin" ? "bg-primary/20 text-primary" : "bg-blue-500/20 text-blue-400"}`}>
                      {user.role === "super_admin" ? "Super Admin" : user.role === "admin" ? "Admin" : "Customer"}
                    </span>
                  </td>
                  <td className="px-6 py-4">{user.isEmailVerified ? <LuCheck className="h-5 w-5 text-green-400" /> : <LuX className="h-5 w-5 text-red-400" />}</td>
                  <td className="px-6 py-4">
                    {user.isKycVerified ? (
                      <span className="inline-flex items-center gap-1 text-xs text-green-400">
                        <LuCheck className="h-4 w-4" /> Verified
                      </span>
                    ) : user.isSubmittedKYC ? (
                      <span className="inline-flex items-center gap-1 text-xs text-yellow-400">
                        <LuTriangleAlert className="h-4 w-4" /> Pending Review
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-xs text-muted-text">
                        <LuX className="h-4 w-4" /> Not Submitted
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${user.isSuspended ? "bg-red-500/20 text-red-400" : "bg-green-500/20 text-green-400"}`}>
                      {user.isSuspended ? "Suspended" : "Active"}
                    </span>
                  </td>
                  <td className="flex justify-end gap-2 px-6 py-4">
                    <button
                      onClick={() => setViewingId(user.id)}
                      className="inline-flex items-center gap-2 rounded-md border border-blue-500/30 px-3 py-2 text-xs text-blue-400 transition hover:bg-blue-500/10">
                      <LuEye className="h-4 w-4" />
                      View
                    </button>
                    {!user.isKycVerified && !user.isSuspended && user.role === "customer" && (
                      <button
                        onClick={() => openKycModal(user.id)}
                        className="inline-flex items-center gap-2 rounded-md border border-green-500/30 px-3 py-2 text-xs text-green-400 transition hover:bg-green-500/10">
                        <LuCheck className="h-4 w-4" />
                        Verify KYC
                      </button>
                    )}
                    <button
                      onClick={() => handleSuspend(user.id, user.isSuspended)}
                      className={`inline-flex items-center gap-2 rounded-md border px-3 py-2 text-xs transition ${
                        user.isSuspended ? "border-blue-500/30 text-blue-400 hover:bg-blue-500/10" : "border-red-500/30 text-red-400 hover:bg-red-500/10"
                      }`}>
                      {loadingIds.includes(user.id) ? (
                        <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                      ) : user.isSuspended ? (
                        <>
                          <LuLockOpen className="h-4 w-4" />
                          Unsuspend
                        </>
                      ) : (
                        <>
                          <LuLock className="h-4 w-4" />
                          Suspend
                        </>
                      )}
                    </button>

                    <button
                      onClick={() => handleDelete(user.id)}
                      className="inline-flex items-center gap-2 rounded-md border border-red-500/30 px-3 py-2 text-xs text-red-400 hover:bg-red-500/10 transition">
                      {loadingIds.includes(user.id) ? (
                        <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                      ) : (
                        <>
                          <LuTrash className="h-4 w-4" />
                          Delete
                        </>
                      )}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {!isLoading && totalPages > 1 && (
        <div className="flex items-center justify-between gap-3 rounded-2xl border border-border bg-card px-4 py-4">
          <p className="text-sm text-muted-text">
            Page {page} of {totalPages}
          </p>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                const nextPage = Math.max(1, page - 1);
                const nextSkip = (nextPage - 1) * take;
                setSkip(nextSkip);
                loadUsers(nextSkip, take);
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
                loadUsers(nextSkip, take);
              }}
              disabled={page >= totalPages}
              className="rounded-md border border-border px-3 py-2 text-sm text-muted-text transition hover:border-primary hover:text-primary disabled:cursor-not-allowed disabled:opacity-50">
              Next
            </button>
          </div>
        </div>
      )}

      {/* View Modal */}
      <Modal isOpen={!!viewingId} title={`User Profile - ${users.find((u) => u.id === viewingId)?.fullName}`} onClose={() => setViewingId(null)} size="md">
        {users.find((u) => u.id === viewingId) && (
          <div className="space-y-6">
            {(() => {
              const user = users.find((u) => u.id === viewingId)!;
              return (
                <>
                  <div className="space-y-4">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-widest text-muted-text">Full Name</p>
                      <p className="mt-1 text-lg font-semibold text-foreground">{user.fullName}</p>
                    </div>

                    <div>
                      <p className="text-xs font-semibold uppercase tracking-widest text-muted-text">Email</p>
                      <p className="mt-1 text-sm text-foreground">{user.email}</p>
                    </div>

                    <div>
                      <p className="text-xs font-semibold uppercase tracking-widest text-muted-text">Phone</p>
                      <p className="mt-1 text-sm text-foreground">{user.phone}</p>
                    </div>

                    <div>
                      <p className="text-xs font-semibold uppercase tracking-widest text-muted-text">Role</p>
                      <p className="mt-1">
                        <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${user.role === "admin" ? "bg-primary/20 text-primary" : "bg-blue-500/20 text-blue-400"}`}>
                          {user.role === "super_admin" ? "Super Admin" : user.role === "admin" ? "Admin" : "Customer"}
                        </span>
                      </p>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-widest text-muted-text">Email Verified</p>
                        <p className="mt-2 flex items-center gap-2">
                          {user.isEmailVerified ? (
                            <>
                              <LuCheck className="h-4 w-4 text-green-400" />
                              <span className="text-sm text-green-400">Verified</span>
                            </>
                          ) : (
                            <>
                              <LuX className="h-4 w-4 text-red-400" />
                              <span className="text-sm text-red-400">Not verified</span>
                            </>
                          )}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs font-semibold uppercase tracking-widest text-muted-text">KYC Status</p>
                        <p className="mt-2 flex items-center gap-2">
                          {user.isKycVerified ? (
                            <>
                              <LuCheck className="h-4 w-4 text-green-400" />
                              <span className="text-sm text-green-400">Verified</span>
                            </>
                          ) : user.isSubmittedKYC ? (
                            <>
                              <LuTriangleAlert className="h-4 w-4 text-yellow-400" />
                              <span className="text-sm text-yellow-400">Pending Review</span>
                            </>
                          ) : (
                            <>
                              <LuX className="h-4 w-4 text-muted-text" />
                              <span className="text-sm text-muted-text">Not Submitted</span>
                            </>
                          )}
                        </p>
                      </div>
                    </div>

                    <div>
                      <p className="text-xs font-semibold uppercase tracking-widest text-muted-text">Account Status</p>
                      <p className="mt-2">
                        <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${user.isSuspended ? "bg-red-500/20 text-red-400" : "bg-green-500/20 text-green-400"}`}>
                          {user.isSuspended ? "Suspended" : "Active"}
                        </span>
                      </p>
                    </div>
                  </div>
                </>
              );
            })()}
          </div>
        )}
      </Modal>

      {/* KYC Review Modal */}
      <Modal isOpen={!!kycId} title={`KYC Review${kycRecord ? ` - ${kycRecord.userId}` : ""}`} onClose={closeKycModal} size="lg">
        {kycLoading ? (
          <Preloader title="Loading KYC" message="Fetching KYC submission..." />
        ) : kycRecord ? (
          <div className="space-y-6">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-muted-text">Document Type</p>
              <p className="mt-1 text-sm text-foreground">{formatDocumentType(kycRecord.documentType)}</p>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-muted-text">Submitted At</p>
              <p className="mt-1 text-sm text-foreground">{formatDateTime(kycRecord.createdAt)}</p>
            </div>

            {kycRecord.reviewedAt && (
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-muted-text">Reviewed At</p>
                <p className="mt-1 text-sm text-foreground">{formatDateTime(kycRecord.reviewedAt)}</p>
              </div>
            )}

            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-muted-text">Document Preview</p>
              <div className="mt-3 flex flex-wrap gap-3">
                <a
                  href={kycRecord.documentUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-md border border-primary/30 bg-primary/10 px-4 py-2 text-sm font-semibold text-primary transition hover:bg-primary/15">
                  <LuEye className="h-4 w-4" />
                  View
                </a>
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold uppercase tracking-widest text-muted-text">Reviewer Note</label>
              <textarea
                value={reviewerNote}
                onChange={(e) => setReviewerNote(e.target.value)}
                rows={3}
                className="w-full mt-2 rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
                placeholder="Optional note to attach when approving or rejecting"
              />
            </div>

            <div>
              <label className="text-xs font-semibold uppercase tracking-widest text-muted-text">Rejection Reason (optional)</label>
              <input
                type="text"
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                className="w-full mt-2 rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
                placeholder="e.g. invalid_document, mismatch, poor_image_quality"
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => kycRecord && handleApproveKyc(kycRecord.id)}
                disabled={kycActionLoading}
                className="flex-1 rounded-md bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-700 disabled:opacity-60">
                {kycActionLoading ? "Approving..." : "Approve"}
              </button>

              <button
                onClick={() => kycRecord && handleRejectKyc(kycRecord.id)}
                disabled={kycActionLoading}
                className="flex-1 rounded-md bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-60">
                {kycActionLoading ? "Rejecting..." : "Reject"}
              </button>
            </div>
          </div>
        ) : (
          <div className="text-sm text-muted-text">No KYC record found.</div>
        )}
      </Modal>
    </div>
  );
}
