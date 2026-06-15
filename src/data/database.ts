// Features
import {
  LuDiamond,
  LuClock,
  LuShieldCheck,
  LuWallet,
  LuShoppingBag,
  LuZap,
  LuUsers,
  LuGift,
  LuCalendarClock,
} from "react-icons/lu";
import RingImage from "../assets/rings-001.jpg";
import EarringsImage from "../assets/earrings-001.jpg";
import NecklacesImage from "../assets/necklace-001.jpg";
import BraceletsImage from "../assets/bracelet-001.jpg";

export const whyChooseTamara = [
  {
    title: "Instant Purchase",
    desc: "Ready-to-own pieces available for immediate checkout. Pay in full and your order is processed right away.",
    icon: LuZap,
  },
  {
    title: "Installment Plans",
    desc: "Lock in your price today and spread payment over 3–12 months. Receive your piece once fully paid.",
    icon: LuClock,
  },
  {
    title: "Ajo / Adashi Groups",
    desc: "Join a trusted community savings circle. Contribute monthly and receive your gold jewelry at maturity.",
    icon: LuUsers,
  },
  {
    title: "Authentic Gold Collections",
    desc: "Every piece is carefully selected — 18k and 22k gold jewelry you can wear with confidence and pride.",
    icon: LuDiamond,
  },
  {
    title: "Secure & Reliable",
    desc: "All payments are manually verified. Your contributions are tracked and protected from start to finish.",
    icon: LuShieldCheck,
  },
  {
    title: "For Every Occasion",
    desc: "Gifts, weddings, celebrations, or personal luxury — we have elegant pieces for every meaningful moment.",
    icon: LuGift,
  },
];

export const paymentOptions = [
  {
    icon: LuShoppingBag,
    title: "Buy Instantly",
    description:
      "Purchase outright and have your piece processed immediately. The fastest way to own your gold.",
  },
  {
    icon: LuCalendarClock,
    title: "Installment Plans",
    description:
      "Spread your payment over 3–12 months. Lock in today's price and receive your piece at completion.",
  },
  {
    icon: LuUsers,
    title: "Ajo / Adashi Savings Groups",
    description:
      "Join a trusted circle and save towards your gold goals. Community-powered purchasing with guaranteed security.",
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
    name: "Tamara Gift Set Slot",
    description:
      "Specially curated for brides and gifting purposes.",
    monthly: 700000,
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
    title: "Total Committed",
    value: "₦0",
    icon: LuWallet,
  },
];

export const jewelryCollections = [
  { name: "Gold Rings", image: RingImage, path: "/shop?category=rings" },
  { name: "Earrings", image: EarringsImage, path: "/shop?category=earrings" },
  { name: "Necklaces", image: NecklacesImage, path: "/shop?category=necklace" },
  { name: "Bracelets", image: BraceletsImage, path: "/shop?category=bracelets" },
];