import { useRecoilState } from "recoil";
import { cartItemsState } from "../atoms/CartAtom";
import { LocalStorage } from "../utils/localStorage";

const useCart = () => {
  // hook states
  const [cartItems, setCartItems] = useRecoilState(cartItemsState);

  // hook functions
  const addItemToCart = (item) => {
    const cartItemInCart = cartItems.find(
      (cartItem) => cartItem?.attributes?.uuid === item?.attributes?.uuid
    );

    if (cartItemInCart) {
      const newCartItems = cartItems.map((cartItem) =>
        cartItem?.attributes?.uuid === cartItemInCart?.attributes?.uuid
          ? { ...cartItemInCart, itemQuantity: cartItemInCart.itemQuantity + 1 }
          : cartItem
      );

      setCartItems(newCartItems);
      LocalStorage.storeValue("cartItems", newCartItems);
    } else {
      const newCartItems = [...cartItems, { ...item, itemQuantity: 1 }];

      setCartItems(newCartItems);
      LocalStorage.storeValue("cartItems", newCartItems);
    }
  };

  const removeItemFromCart = (item) => {
    const newCartItems = cartItems.filter(
      (cartItem) => cartItem?.attributes?.uuid !== item?.attributes?.uuid
    );

    setCartItems(newCartItems);
    LocalStorage.storeValue("cartItems", newCartItems);
  };

  const decreaseCartItemsQuantity = (item) => {
    const cartItemInCart = cartItems.find(
      (cartItem) => cartItem?.attributes?.uuid === item?.attributes?.uuid
    );

    if (cartItemInCart.itemQuantity === 1) {
      removeItemFromCart(item);
    } else {
      const newCartItems = cartItems.map((cartItem) =>
        cartItem?.attributes?.uuid === item?.attributes?.uuid
          ? { ...cartItemInCart, itemQuantity: cartItemInCart.itemQuantity - 1 }
          : cartItem
      );

      setCartItems(newCartItems);
      LocalStorage.storeValue("cartItems", newCartItems);
    }
  };

  const generateOrderlineData = () => {
    let orderlineData = [];

    cartItems.forEach((cartItem) => {
      orderlineData = [
        ...orderlineData,
        {
          name: cartItem?.attributes?.name,
          quantity: cartItem?.itemQuantity,
          product_id: cartItem?.attributes?.product_id,
          form: cartItem?.attributes?.form,
        },
      ];
    });

    return orderlineData;
  };

  return {
    addItemToCart,
    removeItemFromCart,
    decreaseCartItemsQuantity,
    generateOrderlineData,
  };
};

export default useCart;
