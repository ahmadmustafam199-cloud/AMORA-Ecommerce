import { useState } from "react";
import { CartContext } from "./CartContext";

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

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

  const removeFromCart = (productName) => {
    setCart((previousCart) =>
      previousCart.filter((item) => item.name !== productName)
    );
  };

  const totalPrice = cart.reduce((total, item) => {
    const price =
      typeof item.price === "string"
        ? Number(item.price.replace("PKR", "").replace(/,/g, "").trim())
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
      }}
    >
      {children}
    </CartContext.Provider>
  );
};