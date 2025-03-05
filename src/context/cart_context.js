import { createContext, useContext, useReducer, useEffect } from "react";
import reducer from "../reducer/cartReducer";

const CartContext = createContext();

const getLocalCartData = () => {
  let localCartData = localStorage.getItem("thapaCart");
  if (!localCartData) {
    return []; // ✅ अगर localStorage खाली है तो empty array return करो
  }
  try {
    return JSON.parse(localCartData);
  } catch (error) {
    console.error("Error parsing localCartData:", error);
    return [];
  }
};

const initialState = {
  cart: getLocalCartData() || [], // ✅ null चेक करके empty array दो
  total_item: 0,
  total_price: 0,
  shipping_fee: 50000,
};

const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const addToCart = (id, color, amount, product) => {
    dispatch({ type: "ADD_TO_CART", payload: { id, color, amount, product } });
  };

  const setDecrease = (id) => {
    dispatch({ type: "SET_DECREMENT", payload: id });
  };

  const setIncrement = (id) => {
    dispatch({ type: "SET_INCREMENT", payload: id });
  };

  const removeItem = (id) => {
    dispatch({ type: "REMOVE_ITEM", payload: id });
  };

  const clearCart = () => {
    dispatch({ type: "CLEAR_CART" });
  };

  useEffect(() => {
    if (state.cart && Array.isArray(state.cart)) {
      dispatch({ type: "CART_ITEM_PRICE_TOTAL" });
      localStorage.setItem("thapaCart", JSON.stringify(state.cart));
    }
  }, [state.cart]);

  return (
    <CartContext.Provider
      value={{
        ...state,
        addToCart,
        removeItem,
        clearCart,
        setDecrease,
        setIncrement,
      }}>
      {children}
    </CartContext.Provider>
  );
};

const useCartContext = () => {
  return useContext(CartContext);
};

export { CartProvider, useCartContext };
