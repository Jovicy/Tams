// Features
import { LuDiamond, LuClock, LuShieldCheck, LuWallet, LuShoppingBag } from "react-icons/lu";
import RingImage from "../assets/rings.jpg";
import EarringsImage from "../assets/earrings.jpg";
import NecklacesImage from "../assets/necklaces.jpg";
import BraceletsImage from "../assets/bracelets.jpg";

export const paymentOptions = [
  {
    icon: LuDiamond,
    title: "Full Payment",
    description: "Purchase outright and have your piece processed immediately. The traditional way to own gold.",
  },
  {
    icon: LuClock,
    title: "Installment Plans",
    description: "Lock in the price today and pay over 3 to 6 months. Receive your piece upon completion of payment.",
  },
  {
    icon: LuShieldCheck,
    title: "Thrift Contributions (Ajo)",
    description: "Join a trusted circle to save towards your gold goals. Community-powered purchasing with guaranteed security.",
  },
];

export const paymentPlans = [
  {
    id: 1,
    name: "Tamara 20k Gold Slot",
    description: "Perfect for first-time gold buyers looking to save gradually for simple gold jewelry pieces.",
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
    description: "Ideal for customers targeting premium bracelets, necklaces, and medium-value jewelry collections.",
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
    description: "Designed for luxury gold lovers seeking high-value jewelry with structured monthly contributions.",
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
    description: "A premium contribution plan tailored for serious investors and exclusive custom jewelry purchases.",
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
    description: "An elite high-value gold investment circle for luxury collectors and top-tier jewelry acquisition.",
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
    description: "Specially curated for brides-to-be saving toward complete bridal jewelry sets and wedding luxury pieces.",
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
    title: "Total Committed",
    value: "₦0",
    icon: LuWallet,
  },
];

export const jewelryCollections = [
  { name: "Gold Rings", image: RingImage },
  { name: "Earrings", image: EarringsImage },
  { name: "Necklaces", image: NecklacesImage },
  { name: "Bracelets", image: BraceletsImage },
];
