/* eslint-disable react-refresh/only-export-components */
import { createContext, useEffect, useState } from "react";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  // Cart ko localStorage se load karega
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem("cart");

    if (!savedCart) {
      return [];
    }

    try {
      const parsedCart = JSON.parse(savedCart);

      // Old cart data ko bhi normalize karega
      return parsedCart.map((item) => ({
        ...item,

        // Agar image available hai to use karega
        // warna images array ki first image lega
        image:
          item.image ||
          (Array.isArray(item.images) && item.images.length > 0
            ? item.images[0]
            : ""),

        quantity: item.quantity || 1,
      }));
    } catch (error) {
      console.error("Cart Load Error:", error);
      return [];
    }
  });

  // Clear Cart
  const clearCart = () => {
    setCart([]);
  };

  // Cart change hone par localStorage mein save karega
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  // =====================================================
  // ADD PRODUCT
  // =====================================================

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

                // Image ko preserve karega
                image:
                  item.image ||
                  product.image ||
                  (Array.isArray(product.images)
                    ? product.images[0]
                    : ""),
              }
            : item
        );
      }

      // Product ki image normalize karega
      const productImage =
        product.image ||
        (Array.isArray(product.images) && product.images.length > 0
          ? product.images[0]
          : "");

      return [
        ...previousCart,
        {
          ...product,

          // Cart mein singular image bhi save hogi
          image: productImage,

          quantity: 1,
        },
      ];
    });
  };

  // =====================================================
  // INCREASE QUANTITY
  // =====================================================

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

  // =====================================================
  // DECREASE QUANTITY
  // =====================================================

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

  // =====================================================
  // REMOVE PRODUCT
  // =====================================================

  const removeFromCart = (productName) => {
    setCart((previousCart) =>
      previousCart.filter((item) => item.name !== productName)
    );
  };

  // =====================================================
  // TOTAL PRICE
  // =====================================================

  const totalPrice = cart.reduce((total, item) => {
    const price =
      typeof item.price === "string"
        ? Number(
            item.price
              .replace("PKR", "")
              .replace(/,/g, "")
              .trim()
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