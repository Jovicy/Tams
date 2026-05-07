import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { HiMenu, HiX } from "react-icons/hi";

const Navigation = () => {
    const [isOpen, setIsOpen] = useState(false);
    const location = useLocation();

    // detect if user is on dashboard route
    const isDashboard = location.pathname.startsWith("/dashboard");

    // TEMP AUTH STATE (you can replace later with real auth)
    const [isLoggedIn, setIsLoggedIn] = useState(true);

    return (
        <nav className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur supports-backdrop-filter:bg-background/60">

            <div className="container h-20 flex items-center justify-between">

                {/* LEFT SECTION */}
                <div className="flex items-center gap-8">

                    <Link to="/" className="flex items-center">
                        <span className="font-playfair text-2xl font-extrabold text-primary">
                            Tamara Jewelries
                        </span>
                    </Link>

                    <ul className="hidden md:flex items-center gap-6">

                        <li>
                            <Link to="/shop" className="text-sm font-medium text-muted-text hover:text-primary transition">
                                Shop
                            </Link>
                        </li>

                        <li>
                            <Link to="/plans" className="text-sm font-medium text-muted-text hover:text-primary transition">
                                Payment Plans
                            </Link>
                        </li>

                    </ul>
                </div>

                {/* DESKTOP AUTH */}
                <div className="hidden md:flex items-center gap-3">

                    {/* SHOW AUTH ONLY ON DASHBOARD */}
                    {isLoggedIn && isDashboard ? (
                        <>
                            <Link to="/dashboard">
                                <button className="px-5 py-2 text-sm rounded-md bg-primary text-black font-medium hover:opacity-90 transition">
                                    Dashboard
                                </button>
                            </Link>

                            <button
                                onClick={() => setIsLoggedIn(false)}
                                className="px-4 py-2 text-sm rounded-md border border-border text-muted-text hover:text-red-400 hover:border-red-400 transition"
                            >
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/login">
                                <button className="px-4 py-2 text-sm rounded-md border border-border text-muted-text hover:text-primary hover:border-primary transition">
                                    Login
                                </button>
                            </Link>

                            <Link to="/signup">
                                <button className="px-5 py-2 text-sm rounded-md bg-primary text-black font-medium hover:opacity-90 transition">
                                    Create Account
                                </button>
                            </Link>
                        </>
                    )}

                </div>

                {/* MOBILE TOGGLE */}
                <button
                    className="md:hidden text-2xl text-foreground"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    {isOpen ? <HiX size={30} /> : <HiMenu size={30} />}
                </button>

            </div>

            {/* MOBILE MENU */}
            {isOpen && (
                <div className="md:hidden border-t border-border/40 bg-background">
                    <div className="container py-6 flex flex-col gap-6">

                        <Link to="/shop" onClick={() => setIsOpen(false)}>
                            Shop
                        </Link>

                        <Link to="/plans" onClick={() => setIsOpen(false)}>
                            Payment Plans
                        </Link>

                        <div className="border-t border-border/40" />

                        {isLoggedIn && isDashboard ? (
                            <>
                                <Link to="/dashboard" onClick={() => setIsOpen(false)}>
                                    <button className="w-full px-4 py-2 rounded-md bg-primary text-black font-medium">
                                        Dashboard
                                    </button>
                                </Link>

                                <button
                                    onClick={() => {
                                        setIsLoggedIn(false);
                                        setIsOpen(false);
                                    }}
                                    className="w-full px-4 py-2 rounded-md border border-border text-red-400"
                                >
                                    Logout
                                </button>
                            </>
                        ) : (
                            <>
                                <Link to="/login" onClick={() => setIsOpen(false)}>
                                    Login
                                </Link>

                                <Link to="/signup" onClick={() => setIsOpen(false)}>
                                    Create Account
                                </Link>
                            </>
                        )}

                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navigation;
