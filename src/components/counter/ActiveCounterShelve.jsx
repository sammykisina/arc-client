// react framework imports
import { useMemo } from "react";

// icon imports {react icons}

// recoil imports {recoil and atoms}
import { isFetchingCounterShelvesState } from "../../atoms/CounterShelveAtom";
import { useRecoilValue } from "recoil";

// api layer imports

// all components imports {local and packages}
import { Button, SpinnerLoader, Table } from "..";
import useCart from "../../hooks/useCart";
import { cartItemsState } from "../../atoms/CartAtom";

const ActiveCounterShelve = ({ activeCounterShelve }) => {
  // component states
  const isFetchingCounterShelves = useRecoilValue(
    isFetchingCounterShelvesState
  );
  const { addItemToCart } = useCart();
  const cartItems = useRecoilValue(cartItemsState);
  /**
   * active counter shelve
   */
  const activeCounterShelveColumns = useMemo(
    () => [
      {
        Header: "What's Selling Today.",
        columns: [
          {
            Header: "Name",
            accessor: "name",
          },
          {
            Header: "Assigned",
            accessor: "assigned",
          },
          {
            Header: "Sold",
            accessor: "sold",
          },
          {
            Header: "Price",
            accessor: "price",
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
  /**
   * modify the active counter shelve data to a from acceptable by the table
   */
  const modifyActiveCounterShelveData = () => {
    let activeCounterShelveData = [];

    activeCounterShelve?.relationships?.items.forEach((item) => {
      const cartItemInCart = cartItems.find(
        (cartItem) => cartItem?.attributes?.uuid === item?.attributes?.uuid
      );

      activeCounterShelveData = [
        ...activeCounterShelveData,
        {
          name: item?.attributes?.name,
          assigned: item?.attributes?.assigned,
          sold: item?.attributes?.sold,
          price: item?.attributes?.price,
          actions: [
            <div className="flex gap-x-3 " key={item?.attributes?.uuid}>
              <Button
                title="Sell"
                buttonStyles="primaryButton disabled:cursor-not-allowed disabled:bg-c_yellow/50"
                purpose={() => addItemToCart(item)}
                disabled={cartItemInCart ? true : false}
              />
            </div>,
          ],
        },
      ];
    });

    return activeCounterShelveData;
  };

  return (
    <section>
      {isFetchingCounterShelves ? (
        <div className="mt-24 ">
          <SpinnerLoader color="fill-[#2C7A51]" />
        </div>
      ) : activeCounterShelve ? (
        <Table
          columns={activeCounterShelveColumns}
          data={modifyActiveCounterShelveData()}
          showFilters
          tableHeight="h-[450px] md:h-[470px] lg:h-[515px]"
        />
      ) : (
        <div className="border flex justify-center py-2  rounded-md text-c_dark border-c_gray tracking-wide mt-16">
          Not in Shift Today.
        </div>
      )}
    </section>
  );
};

export default ActiveCounterShelve;
