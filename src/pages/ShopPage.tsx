import { useState } from "react";
import { products } from "../data/database";
import { LuSearch } from "react-icons/lu";
import { Link } from "react-router-dom";

const categories = ["All Pieces", "Rings", "Necklaces", "Bracelets", "Earrings"];

export default function ShopPage() {
    const [activeCategory, setActiveCategory] = useState("All Pieces");
    const [search, setSearch] = useState("");

    const filteredProducts = products.filter((item) => {
        const matchesCategory =
            activeCategory === "All Pieces" || item.category === activeCategory;

        const matchesSearch = item.name
            .toLowerCase()
            .includes(search.toLowerCase());

        return matchesCategory && matchesSearch;
    });

    return (
        <div className="container mx-auto px-4 py-12">

            {/* HEADER */}
            <section className="mb-12 text-center max-w-2xl mx-auto">
                <h1 className="font-playfair text-4xl md:text-5xl font-bold mb-4">
                    The Collection
                </h1>
                <p className="text-muted-text">
                    Explore our curated selection of fine 18k and 22k gold jewelry.
                </p>
            </section>

            {/* FILTER + SEARCH */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">

                {/* Categories */}
                <div className="flex overflow-x-auto pb-2 -mx-4 px-4 md:mx-0 md:px-0 md:pb-0 w-full md:w-auto hide-scrollbar gap-2">
                    {categories.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setActiveCategory(cat)}
                            className={`
                                inline-flex items-center justify-center
                                px-4 py-2 rounded-full text-sm font-medium
                                transition-all duration-200

                                whitespace-nowrap

                                focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring
                                disabled:pointer-events-none disabled:opacity-50

                                border border-white/20

                                ${activeCategory === cat
                                    ? "bg-primary text-black border-primary"
                                    : "text-muted-foreground hover:text-white hover:border-primary hover:bg-accent"
                                }
                            `}
                        >
                            {cat}
                        </button>
                    ))}

                </div>

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
            </div>

            {/* PRODUCTS GRID */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-10">
                {filteredProducts.map((item) => (
                    <Link
                        to={`/product/${item.id}`}
                        key={item.id}
                        className="group flex flex-col"
                    >
                        {/* Image as background */}
                        <div className="relative aspect-4/5 rounded-xl overflow-hidden mb-4 border border-border">

                            <div
                                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                                style={{
                                    backgroundImage: `url(${item.image})`,
                                }}
                            />

                            <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                        </div>

                        {/* Content */}
                        <div className="flex flex-col flex-1">

                            <h3 className="font-playfair font-semibold text-lg line-clamp-1 group-hover:text-primary transition-colors mb-1">
                                {item.name}
                            </h3>

                            <p className="text-xl font-playfair font-medium text-foreground mb-3">
                                ₦{item.price.toLocaleString()}
                            </p>

                            <div className="flex gap-2 flex-wrap mt-auto">
                                {item.plans.map((plan, index) => (
                                    <span
                                        key={index}
                                        className="text-xs px-2.5 py-1 border border-border rounded-md text-muted-foreground"
                                    >
                                        {plan}
                                    </span>
                                ))}
                            </div>

                        </div>
                    </Link>
                ))}

            </div>
        </div>
    );
}
