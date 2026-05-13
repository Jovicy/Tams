import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { LuTrendingUp, LuClipboardList, LuBox, LuUsers, LuLogOut, LuMenu, LuX, LuTags } from "react-icons/lu";
import { useState } from "react";
import { signOut } from "../store/authStore";

const adminLinks = [
  { to: "/admin", label: "Dashboard", icon: LuTrendingUp },
  { to: "/admin/orders", label: "Orders", icon: LuClipboardList },
  // Installments and Contributions removed
  { to: "/admin/products", label: "Products", icon: LuBox },
  { to: "/admin/categories", label: "Categories", icon: LuTags },
  { to: "/admin/users", label: "Users", icon: LuUsers },
  // KYC Reviews removed
];

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    signOut();
    setSidebarOpen(false);
    navigate("/admin/login", { replace: true });
  };

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 z-40 h-full w-64 border-r border-border/60 bg-card/95 backdrop-blur transition-transform duration-300 lg:relative lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}>
        <div className="flex h-full flex-col gap-6 p-6">
          {/* Logo */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">Admin Area</p>
            <h1 className="font-playfair text-lg font-bold text-foreground mt-1">Tamara Control</h1>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1">
            {adminLinks.map((link) => {
              const Icon = link.icon;
              return (
                <NavLink
                  key={link.to}
                  to={link.to}
                  end={link.to === "/admin"}
                  className={({ isActive }) =>
                    ["flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition", isActive ? "bg-primary text-black" : "text-muted-text hover:bg-primary/10 hover:text-primary"].join(
                      " ",
                    )
                  }>
                  <Icon className="h-5 w-5" />
                  {link.label}
                </NavLink>
              );
            })}
          </nav>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 rounded-lg border border-border px-4 py-3 text-sm font-medium text-muted-text transition hover:border-red-500 hover:text-red-400">
            <LuLogOut className="h-5 w-5" />
            Logout
          </button>
        </div>
      </aside>

      {/* Mobile overlay */}
      {sidebarOpen && <div className="fixed inset-0 z-30 bg-black/50 lg:hidden" onClick={() => setSidebarOpen(false)} />}

      {/* Main content */}
      <div className="flex-1">
        <header className="border-b border-border/60 bg-card/80 backdrop-blur sticky top-0 z-20">
          <div className="flex items-center justify-between px-4 py-4 md:px-6">
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="rounded-lg border border-border p-2 text-muted-text hover:text-foreground lg:hidden">
              {sidebarOpen ? <LuX className="h-6 w-6" /> : <LuMenu className="h-6 w-6" />}
            </button>

            <h1 className="font-playfair text-2xl font-bold text-foreground flex-1 text-center lg:text-left">Tamara Jewelries Admin</h1>
          </div>
        </header>

        <main className="p-6 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
