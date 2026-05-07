// Jewelry Collections
import rings from "../assets/rings.jpg";
import necklaces from "../assets/necklaces.jpg";
import bracelets from "../assets/bracelets.jpg";
import earrings from "../assets/earrings.jpg";
import bracelets1 from "../assets/features-img.jpg";
import necklaces1 from "../assets/header-bg.jpg";

// Features
import {
  LuDiamond,
  LuClock,
  LuShieldCheck,
  LuPackage,
  LuClock3,
  LuUsers,
  LuWallet,
  LuShoppingBag,
} from "react-icons/lu";

export const jewelryCollections = [
  {
    name: "Rings",
    image: rings,
  },
  {
    name: "Necklaces",
    image: necklaces,
  },
  {
    name: "Bracelets",
    image: bracelets,
  },
  {
    name: "Earrings",
    image: earrings,
  },
];

export const paymentOptions = [
  {
    icon: LuDiamond,
    title: "Full Payment",
    description:
      "Purchase outright and have your piece processed immediately. The traditional way to own gold.",
  },
  {
    icon: LuClock,
    title: "Installment Plans",
    description:
      "Lock in the price today and pay over 3 to 6 months. Receive your piece upon completion of payment.",
  },
  {
    icon: LuShieldCheck,
    title: "Thrift Contributions (Ajo)",
    description:
      "Join a trusted circle to save towards your gold goals. Community-powered purchasing with guaranteed security.",
  },
];

// data/products.js
export const products = [
  {
    id: 1,
    name: "Royal Solitaire Ring",
    price: 285000,
    category: "Rings",
    image: rings,
    weight: "4.2g",
    karat: "18K",
    description:
      "A timeless solitaire ring crafted in premium gold, designed to highlight elegance and royalty in its purest form.",
    plans: ["Full", "Installment", "Thrift"],
  },
  {
    id: 2,
    name: "Cascade Necklace",
    price: 520000,
    category: "Necklaces",
    image: necklaces,
    weight: "12.5g",
    karat: "22K",
    description:
      "A luxurious cascading necklace designed with layered gold detailing for a bold and graceful statement look.",
    plans: ["Full", "Installment"],
  },
  {
    id: 3,
    name: "Sovereign Bracelet",
    price: 195000,
    category: "Bracelets",
    image: bracelets,
    weight: "7.8g",
    karat: "18K",
    description:
      "A refined sovereign bracelet combining durability and elegance, perfect for everyday luxury wear.",
    plans: ["Full", "Installment", "Thrift"],
  },
  {
    id: 4,
    name: "Heirloom Drop Earrings",
    price: 145000,
    category: "Earrings",
    image: earrings,
    weight: "3.1g",
    karat: "18K",
    description:
      "Elegant drop earrings designed to pass down as a timeless heirloom, blending simplicity with class.",
    plans: ["Full", "Installment"],
  },
  {
    id: 5,
    name: "Empress Bracelet",
    price: 195000,
    category: "Bracelets",
    image: bracelets1,
    weight: "8.0g",
    karat: "22K",
    description:
      "A bold empress-style bracelet made for confidence and luxury, symbolizing power and beauty.",
    plans: ["Full", "Installment", "Thrift"],
  },
  {
    id: 6,
    name: "Royal Necklace",
    price: 520000,
    category: "Necklaces",
    image: necklaces1,
    weight: "13.2g",
    karat: "22K",
    description:
      "A premium royal necklace crafted for high elegance, designed to stand out in any occasion.",
    plans: ["Full", "Installment"],
  },
];

export const paymentPlans = [
  {
    id: 1,
    name: "Tamara 20k Gold Slot",
    description:
      "Perfect for first-time gold buyers looking to save gradually for simple gold jewelry pieces.",
    monthly: 20000,
    months: 12,
    total: 240000,
    members: 8,
    maxMembers: 20,
    spotsLeft: 12,
  },

  {
    id: 2,
    name: "Tamara 50k Gold Slot",
    description:
      "Ideal for customers targeting premium bracelets, necklaces, and medium-value jewelry collections.",
    monthly: 50000,
    months: 12,
    total: 600000,
    members: 6,
    maxMembers: 15,
    spotsLeft: 9,
  },

  {
    id: 3,
    name: "Tamara 100k Gold Slot",
    description:
      "Designed for luxury gold lovers seeking high-value jewelry with structured monthly contributions.",
    monthly: 100000,
    months: 12,
    total: 1200000,
    members: 4,
    maxMembers: 10,
    spotsLeft: 6,
  },

  {
    id: 4,
    name: "Tamara 200k Gold Slot",
    description:
      "A premium contribution plan tailored for serious investors and exclusive custom jewelry purchases.",
    monthly: 200000,
    months: 12,
    total: 2400000,
    members: 3,
    maxMembers: 8,
    spotsLeft: 5,
  },

  {
    id: 5,
    name: "Tamara 500k Gold Slot",
    description:
      "An elite high-value gold investment circle for luxury collectors and top-tier jewelry acquisition.",
    monthly: 500000,
    months: 12,
    total: 6000000,
    members: 2,
    maxMembers: 5,
    spotsLeft: 3,
  },

  {
    id: 6,
    name: "Tamara Bridal Slot",
    description:
      "Specially curated for brides-to-be saving toward complete bridal jewelry sets and wedding luxury pieces.",
    monthly: 150000,
    months: 12,
    total: 1800000,
    members: 5,
    maxMembers: 12,
    spotsLeft: 7,
  },
];

export const stats = [
  {
    title: "Total Orders",
    value: 0,
    icon: LuShoppingBag,
  },
  {
    title: "Pending Orders",
    value: 0,
    icon: LuShoppingBag,
  },
  {
    title: "Active Plans",
    value: 0,
    icon: LuUsers,
  },
  {
    title: "Total Committed",
    value: "₦0",
    icon: LuWallet,
  },
];