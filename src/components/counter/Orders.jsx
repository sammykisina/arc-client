import { useState } from "react";
import { useEffect } from "react";
import { useRecoilState } from "recoil";
import { OrderAPI } from "../../api/orderApi";
import { allOrdersFromDBState } from "../../atoms/OrderAtom";

const Orders = () => {
  // component states
  const [allOrdersFromDB, setAllOrdersFromDB] =
    useRecoilState(allOrdersFromDBState);
  const [isFetchingOrders, setIsFetchingOrders] = useState(false);

  console.log("allOrdersFromDB", allOrdersFromDB);

  // component

  /**
   * fetch all the orders
   */
  useEffect(() => {
    setIsFetchingOrders(true);

    OrderAPI.getAll()
      .then((orders) => {
        setAllOrdersFromDB(orders);
      })
      .finally(() => setIsFetchingOrders(false));
  }, []);

  return <div>Orders</div>;
};

export default Orders;
