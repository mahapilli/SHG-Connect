import { useMemo, useState } from "react";
import { AppContext } from "./appContextValue";

const demoUser = {
  Customer: { name: "Aarav Sharma", initials: "AS" },
  "SHG Member": { name: "Meena Devi", initials: "MD", group: "Sakhi Women SHG" },
  Admin: { name: "Platform Admin", initials: "PA" },
};

export function AppProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("shg-connect-user")) || null;
    } catch {
      return null;
    }
  });
  const [cartItems, setCartItems] = useState([]);

  const login = (role) => {
    const nextUser = { role, ...demoUser[role] };
    setUser(nextUser);
    localStorage.setItem("shg-connect-user", JSON.stringify(nextUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("shg-connect-user");
  };

  const addToCart = (product) => {
    if (product.stock <= 0) return;
    setCartItems((items) => {
      const existing = items.find((item) => item.id === product.id);
      if (!existing) return [...items, { ...product, quantity: 1 }];
      if (existing.quantity >= product.stock) return items;
      return items.map((item) =>
        item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item,
      );
    });
  };

  const updateCartQuantity = (id, delta) => {
    setCartItems((items) =>
      items
        .map((item) =>
          item.id === id
            ? { ...item, quantity: Math.min(item.stock, item.quantity + delta) }
            : item,
        )
        .filter((item) => item.quantity > 0),
    );
  };

  const removeFromCart = (id) => {
    setCartItems((items) => items.filter((item) => item.id !== id));
  };

  const value = useMemo(
    () => ({
      user,
      login,
      logout,
      cartItems,
      cartCount: cartItems.reduce((total, item) => total + item.quantity, 0),
      cartTotal: cartItems.reduce((total, item) => total + item.price * item.quantity, 0),
      addToCart,
      updateCartQuantity,
      removeFromCart,
    }),
    [user, cartItems],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

