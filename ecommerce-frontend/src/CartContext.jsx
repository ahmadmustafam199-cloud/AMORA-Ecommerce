/* eslint-disable react-refresh/only-export-components */
import { createContext, useEffect, useState } from "react";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  // Cart ko localStorage se load karega
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem("cart");

    return savedCart ? JSON.parse(savedCart) : [];
  });
 
  const clearCart = () => {
  setCart([]);
};
  // Cart change hone par localStorage mein save karega
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  // Add Product
  const addToCart = (product) => {
    setCart((previousCart) => {
      const existingProduct = previousCart.find(
        (item) => item.name === product.name
      );

      if (existingProduct) {
        return previousCart.map((item) =>
          item.name === product.name
            ? {
                ...item,
                quantity: item.quantity + 1,
              }
            : item
        );
      }

      return [
        ...previousCart,
        {
          ...product,
          quantity: 1,
        },
      ];
    });
  };

  // Increase Quantity
  const increaseQuantity = (productName) => {
    setCart((previousCart) =>
      previousCart.map((item) =>
        item.name === productName
          ? {
              ...item,
              quantity: item.quantity + 1,
            }
          : item
      )
    );
  };

  // Decrease Quantity
  const decreaseQuantity = (productName) => {
    setCart((previousCart) =>
      previousCart
        .map((item) =>
          item.name === productName
            ? {
                ...item,
                quantity: item.quantity - 1,
              }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  // Remove Product
  const removeFromCart = (productName) => {
    setCart((previousCart) =>
      previousCart.filter((item) => item.name !== productName)
    );
  };

  // Total Price
  const totalPrice = cart.reduce((total, item) => {
    const price =
      typeof item.price === "string"
        ? Number(
            item.price.replace("PKR", "").replace(/,/g, "").trim()
          )
        : Number(item.price);

    return total + price * item.quantity;
  }, 0);
  

  return (
    <CartContext.Provider
  value={{
    cart,
    addToCart,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
    totalPrice,
    clearCart,
  }}
>
      {children}
    </CartContext.Provider>
  );
};