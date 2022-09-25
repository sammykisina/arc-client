// react framework imports
import React, { useMemo } from "react";

// icon imports {react icons}
import { BiMinus, BiPlus } from "react-icons/bi";
import { CgClose } from "react-icons/cg";

// recoil imports {recoil and atoms}
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { cartItemsState } from "../../atoms/CartAtom";
import { showCreateOrEditOrderModalState } from "../../atoms/ModalAtoms";

// api layer imports

// all components imports {local and packages}
import { Button, InteractiveButton, Modal, Stepper, Table, ToolTip } from "../";
import ctr from "@netlify/classnames-template-literals";
import useCart from "../../hooks/useCart";
import { OrderInfo } from "../ui-reusable-small-components/order";
import { globalOrderObjectState } from "../../atoms/OrderAtom";
import { LocalStorage } from "../../utils/localStorage";
import { counterTabsIndexState } from "../../atoms/TabAtom";

const Cart = () => {
  // component states
  const cartItems = useRecoilValue(cartItemsState);
  const {
    removeItemFromCart,
    decreaseCartItemsQuantity,
    addItemToCart,
    generateOrderlineData,
  } = useCart();
  const setShowCreateOrEditOrderModal = useSetRecoilState(
    showCreateOrEditOrderModalState
  );
  const setGlobalOrderObject = useSetRecoilState(globalOrderObjectState);
  const setCounterTabsIndex = useSetRecoilState(counterTabsIndexState);
  const setCartItems = useSetRecoilState(cartItemsState);

  // cart calculations
  const subTotal = cartItems.reduce(
    (previousValue, cartItem) =>
      previousValue + cartItem.itemQuantity * cartItem?.attributes?.price,
    0
  );
  const taxPrice = Math.round(subTotal * 0.14 * 10) / 10;
  const totalPrice = subTotal + taxPrice;
  const discount =
    totalPrice > import.meta.env.VITE_ARC_DISCOUNT_LEGIBLE_AMOUNT
      ? Math.round(totalPrice * import.meta.env.VITE_ARC_DISCOUNT * 10) / 10
      : 0;
  const finalTotalPrice = totalPrice - discount;

  // const steps = [
  //   {
  //     title: "Order Info",
  //     content: (
  //       <OrderInfo
  //         subTotal={subTotal}
  //         taxPrice={taxPrice}
  //         discount={discount}
  //         finalTotalPrice={finalTotalPrice}
  //       />
  //     ),
  //   },
  //   {
  //     title: "Create Order",
  //     content: "Shipping Info form",
  //   },
  //   {
  //     title: "Finish",
  //     content: <FinishOrder />,
  //   },
  // ];

  const cartsTableColumns = useMemo(
    () => [
      {
        Header: "Current Customer Ordered Items",
        columns: [
          {
            Header: () => null,
            accessor: "remove",
          },
          {
            Header: "Name",
            accessor: "name",
          },
          {
            Header: "Quantity",
            accessor: "quantity",
          },
          {
            Header: "Price",
            accessor: "price",
          },
          {
            Header: "Total",
            accessor: "total",
          },
          {
            Header: () => null,
            accessor: "actions",
          },
        ],
      },
    ],
    []
  );

  // component functions
  const modifyCartItemsData = () => {
    setGlobalOrderObject;
    let cartItemsData = [];

    cartItems.forEach((cartItem) => {
      cartItemsData = [
        ...cartItemsData,
        {
          remove: [
            <div key={cartItem?.id}>
              <ToolTip
                component={
                  <Button
                    icon={<CgClose className={`text-c_green`} />}
                    buttonStyles="p-1 w-fit h-fit  rounded-full flex justify-center items-center bg-c_green_light"
                    purpose={() => {
                      removeItemFromCart(cartItem);
                    }}
                  />
                }
                tipTitle="Remove"
              />
            </div>,
          ],
          name: cartItem?.attributes?.name,
          quantity: cartItem?.itemQuantity,
          price: cartItem?.attributes?.price,
          total: cartItem?.attributes?.price * cartItem?.itemQuantity,
          actions: [
            <div
              className="flex flex-row gap-3 items-center"
              key={cartItem?.attributes?.uuid}
            >
              <Button
                icon={<BiMinus className="" />}
                buttonStyles={actionButtonStyles}
                purpose={() => decreaseCartItemsQuantity(cartItem)}
              />

              {/* the current quantity of items */}
              <div className="text-c_dark col-span-1 w-5 h-5 flex justify-center items-center">
                {cartItem?.itemQuantity}
              </div>

              <Button
                icon={<BiPlus className="" />}
                buttonStyles={actionButtonStyles}
                purpose={() => addItemToCart(cartItem)}
                disabled={
                  cartItem?.itemQuantity >= cartItem?.attributes?.assigned
                }
              />
            </div>,
          ],
        },
      ];
    });

    return cartItemsData;
  };

  const handlePLaceOrder = () => {
    const orderData = {
      sub_total: totalPrice,
      discount: discount,
      total: finalTotalPrice,
      orderline_data: generateOrderlineData(),
    };

    setGlobalOrderObject(orderData);
    setShowCreateOrEditOrderModal(true);
  };

  return (
    <section>
      {cartItems.length === 0 ? (
        <div className="border flex justify-center py-2  rounded-md text-c_dark border-c_gray tracking-wide mt-16">
          No Items Yet.
        </div>
      ) : (
        <div className="flex flex-col gap-1">
          <Table
            columns={cartsTableColumns}
            data={modifyCartItemsData()}
            showFilters
            tableHeight="h-[380px] md:h-[400px] lg:h-[440px]"
          />

          <div className="flex justify-end">
            <div className="flex gap-3 items-center">
              <OrderInfo
                subTotal={subTotal}
                taxPrice={taxPrice}
                discount={discount}
                finalTotalPrice={finalTotalPrice}
              />

              <div className="flex flex-col gap-4 justify-center items-center">
                <InteractiveButton
                  title="Place Order"
                  buttonWrapperStyles={`text-center py-2 px-4 bg-c_yellow rounded-full text-white w-fit h-fit text-sm $`}
                  arrowsPosition="right"
                  purpose={handlePLaceOrder}
                />

                <InteractiveButton
                  title="Clear Cart"
                  buttonWrapperStyles={`text-center py-2 px-4 bg-c_yellow rounded-full text-white w-fit h-fit text-sm $`}
                  arrowsPosition="right"
                  purpose={() => {
                    LocalStorage.storeValue("cartItems", []);
                    setCartItems([]);
                    setCounterTabsIndex(0);
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

//  styles
const actionButtonStyles = ctr(`
  bg-c_green_light 
  text-c_green 
  p-1 
  rounded-full
  hover:text-c_dark
  hover:bg-c_green_light/50
  col-span-1
  disabled:cursor-not-allowed
  disabled:bg-c_green_light/50
  disabled:text-c_green/50
`);

export default Cart;
