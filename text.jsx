<div className="flex flex-row justify-end text-c_dark px-6 py-3 rounded-md border-c_gray/40 gap-y-2 items-center gap-x-6 border w-fit">
  {/* order details */}
  <div>
    {/* subtotal */}
    <div className=" justify-end gap-x-8 grid grid-cols-2">
      <div className="flex justify-end items-center">SubTotal</div>
      <span>{subTotal}</span>
    </div>

    {/* tax */}
    <div className="justify-end gap-x-8 grid grid-cols-2">
      <div className="flex justify-end items-center">Tax</div>
      <span>{taxPrice}</span>
    </div>

    {/* discount */}
    <div className="justify-end gap-x-8 grid grid-cols-2">
      <div className="flex justify-end items-center">Discount</div>
      <span>{discount}</span>
    </div>

    {/* total (plus tax) */}
    <div className="justify-end gap-x-8  grid grid-cols-2">
      <div className=" flex justify-end items-center">Total</div>
      <span className=" font-semibold text-lg">{finalTotalPrice}</span>
    </div>
  </div>

  {/* process button */}
  <Button
    title="Process"
    buttonStyles="flex items-center gap-x-2 px-4 py-2 bg-c_yellow rounded-xl text-white"
    purpose={handleProcess}
  />
</div>;
