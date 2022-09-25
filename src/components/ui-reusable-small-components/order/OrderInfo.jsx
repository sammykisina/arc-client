export const OrderInfoCard = ({ label, value, extraValueStyles }) => (
  <div className="justify-end gap-x-8  grid grid-cols-2">
    <div className="flex justify-end items-center">{label}</div>
    <span className={`${extraValueStyles}`}>{value}</span>
  </div>
);

const OrderInfo = ({ subTotal, taxPrice, discount, finalTotalPrice }) => {
  return (
    <section className="flex flex-row justify-end text-c_dark py-2  px-6  rounded-md border-c_gray/40 items-center gap-x-6 border w-fit">
      {/* order details */}
      <div>
        {/* subtotal */}
        <OrderInfoCard label="Sub Total" value={subTotal} />

        {/* tax */}
        <OrderInfoCard label="Tax" value={taxPrice} />

        {/* discount */}
        <OrderInfoCard label="Discount" value={discount} />

        {/* total (plus tax) */}
        <OrderInfoCard
          label="Total"
          value={finalTotalPrice}
          extraValueStyles="font-semibold text-lg text-c_dark"
        />
      </div>
    </section>
  );
};

export default OrderInfo;
