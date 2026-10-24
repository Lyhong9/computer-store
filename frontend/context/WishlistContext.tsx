"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { Product } from "@/types/store";

interface WishlistContextType {
  wishlist: Product[];
  isInWishlist: (productId: number) => boolean;
  addToWishlist: (product: Product) => void;
  removeFromWishlist: (productId: number) => void;
  toggleWishlist: (product: Product) => void;
  clearWishlist: () => void;
  totalWishlistItems: number;
  isWishlistOpen: boolean;
  setIsWishlistOpen: (open: boolean) => void;
  notificationMessage: string | null;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [wishlist, setWishlist] = useState<Product[]>([]);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState<string | null>(null);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem("techshop_wishlist");
      if (saved) {
        setWishlist(JSON.parse(saved));
      }
    } catch (e) {
      console.warn("Failed to read wishlist from localStorage:", e);
    } finally {
      setIsInitialized(true);
    }
  }, []);

  // Save to localStorage on change
  useEffect(() => {
    if (!isInitialized) return;
    try {
      localStorage.setItem("techshop_wishlist", JSON.stringify(wishlist));
    } catch (e) {
      console.warn("Failed to save wishlist to localStorage:", e);
    }
  }, [wishlist, isInitialized]);

  const showNotification = (msg: string) => {
    setNotificationMessage(msg);
    setTimeout(() => {
      setNotificationMessage((current) => (current === msg ? null : current));
    }, 2500);
  };

  const isInWishlist = (productId: number) => {
    return wishlist.some((p) => p.id === productId);
  };

  const addToWishlist = (product: Product) => {
    setWishlist((prev) => {
      if (prev.some((p) => p.id === product.id)) return prev;
      return [product, ...prev];
    });
    showNotification(`Added "${product.name}" to your wishlist`);
  };

  const removeFromWishlist = (productId: number) => {
    setWishlist((prev) => {
      const found = prev.find((p) => p.id === productId);
      if (found) {
        showNotification(`Removed "${found.name}" from your wishlist`);
      }
      return prev.filter((p) => p.id !== productId);
    });
  };

  const toggleWishlist = (product: Product) => {
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  const clearWishlist = () => {
    setWishlist([]);
    showNotification("Wishlist cleared");
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        isInWishlist,
        addToWishlist,
        removeFromWishlist,
        toggleWishlist,
        clearWishlist,
        totalWishlistItems: wishlist.length,
        isWishlistOpen,
        setIsWishlistOpen,
        notificationMessage,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }
  return context;
}
