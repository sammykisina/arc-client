import React from "react";
import { useRecoilState } from "recoil";
import { globalOrderObjectState } from "../../../atoms/OrderAtom";

const CreateOrEditOrder = () => {
  // component states
  const [globalOrderObject, setGlobalOrderObject] = useRecoilState(
    globalOrderObjectState
  );
  // console.log("data", globalOrderObject);
  // component functions
  return <div>CreateOrder</div>;
};

export default CreateOrEditOrder;
