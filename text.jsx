ProductVariantAPI.create({
  name: name,
  cost: parseInt(cost),
  retail: parseInt(retail),
  initial_number_of_pieces: parseInt(initial_number_of_pieces),
  measure: parseInt(measure),
  product_id: selectedProduct.value,
  vat: allowVAT,
}).then((response) => {
  // adding the created variant product variant

  // find the product we are trying to create the variant for
  const product = allProductsFromDB.find(
    (productFromDB) => productFromDB?.id === selectedProduct.value
  );

  // appending the variant together with other product variants
  const newProducts = allProductsFromDB.map((productFromDB) =>
    productFromDB?.id === product?.id
      ? {
          ...productFromDB,
          relationships: {
            ...productFromDB?.relationships,
            variants: [
              ...productFromDB?.relationships?.variants,
              {
                ...response.variant,
                attributes: {
                  ...response.variant.attributes,
                  active: allowVAT,
                  inventory: {
                    ...response.variant.attributes?.inventory,
                    sold: 0,
                  },
                },
              },
            ],
          },
        }
      : productFromDB
  );

  // set the new products
  setAllProductsFromDB(newProducts);

  // refresh the browser to remove the added product variant from the ui
  response.error === 1
    ? window.location.reload(false)
    : Notification.successNotification(response.message);
});


options={[
            { name: "name", value: "value" },
            { name: "name", value: "value" },
            { name: "name", value: "value" },
            { name: "name", value: "value" },
            { name: "name", value: "value" },
            { name: "name", value: "value" },
            { name: "name", value: "value" },
            { name: "name", value: "value" },
            { name: "name", value: "value" },
            { name: "name", value: "value" },
            { name: "name", value: "value" },
            { name: "name", value: "value" },
            { name: "name", value: "value" },
            { name: "name", value: "value" },
            { name: "name", value: "value" },
            { name: "name", value: "value" },
            { name: "name", value: "value" },
            { name: "name", value: "value" },
            { name: "name", value: "value" },
            { name: "name", value: "value" },
            { name: "name", value: "value" },
            { name: "last", value: "value" },
          ]}



           const productPageTabs = [
    {
      label: "Categories",
      value: "categories",
      content: (
        <section>
          {/* the add category button */}
          <div>
            <Button
              title="Category"
              icon={<HiPlus className="w-5 h-5 text-c_white" />}
              buttonStyles="primaryButton"
              buttonTitleWrapperStyles="hidden sm:block"
              purpose={() => {
                setShowCreateOrEditCategoryModal(true);
              }}
            />
          </div>

          {/* the table */}
          <div className="mt-5 w-full">
            {isFetchingCategories ? (
              <div className="mt-24">
                <SpinnerLoader color="fill-[#2C7A51]" />
              </div>
            ) : (
              <Table
                columns={categoriesTableColumns}
                data={getCategoriesDataForCategoriesTable()}
                showFilters
                tableHeight="h-[350px] md:h-[380px] lg:h-[435px]"
              />
            )}
          </div>
        </section>
      ),
    },
    {
      label: "Products",
      value: "products",
      content: (
        <section>
          {/* the add product button */}
          <div className="flex flex-row gap-x-2">
            {/* the add product button */}
            <Button
              title="Product"
              icon={<HiPlus className="w-5 h-5 text-c_white" />}
              buttonStyles="primaryButton"
              buttonTitleWrapperStyles="hidden sm:block"
              purpose={() => {
                setShowCreateOrEditProduct(true);
              }}
            />

            <Button
              title="Variant"
              icon={<HiPlus className="w-5 h-5 text-c_white" />}
              buttonStyles="primaryButton"
              buttonTitleWrapperStyles="hidden sm:block"
              purpose={() => {
                setShowCreateOrEditProductVariantModal(true);
              }}
            />
          </div>

          {/* the table */}
          <div className="mt-5 w-full">
            {isFetchingProducts ? (
              <div className="mt-24">
                <SpinnerLoader color="fill-[#2C7A51]" />
              </div>
            ) : (
              <Table
                columns={productsTableColumns}
                data={getProductsDataForProductsTable()}
                renderRowSubComponent={renderRowSubComponent}
                showFilters
                tableHeight="h-[350px] md:h-[380px] lg:h-[435px]"
              />
            )}
          </div>
        </section>
      ),
    },
];
  

<div className="sm:flex justify-center items-center">
            <form className={formStyles} onSubmit={handleSubmit(onSubmit)}>
              {productInputs.map((productInput, productInputIndex) => (
                <div
                  key={productInputIndex}
                  className={`h-fit ${productInput.gap && "mt-5 sm:mt-0 "}`}
                >
                  {productInput.component === "Input" ? (
                    <div
                      className={`input-group w-[250px] sm:w-[220px] md:w-[240px] ${productInput.extraClasses}`}
                    >
                      <input
                        type={productInput.type}
                        placeholder=""
                        {...register(productInput.name, {
                          required: productInput.required,
                        })}
                        className="input"
                      />

                      <label className="placeholder">
                        {productInput.label}
                      </label>

                      {errors[productInput.name] && (
                        <span className="error">
                          {productInput.errorMessage}
                        </span>
                      )}
                    </div>
                  ) : productInput.component === "Select" ? (
                    <div className="input-group w-[250px] sm:w-[220px] md:w-[240px]">
                      <div className="input">
                        <Select
                          title="-"
                          options={productInput?.options}
                          selected={selectedCategory}
                          setSelected={setSelectedCategory}
                        />
                      </div>

                      <label className="placeholder">
                        {productInput.label}
                      </label>
                    </div>
                  ) : (
                    <div
                      className={`ml-2 sm:ml-4 w-[250px] sm:w-[200px] md:w-[240px] ${productInput.extraClasses}`}
                    >
                      <CheckBox
                        label="VAT"
                        checkLabelStyles="text-c_dark"
                        checkIconStyles="text-c_yellow"
                        isChecked={allowVAT}
                        setIsChecked={setAllowVAT}
                      />
                    </div>
                  )}
                </div>
              ))}

              <div className={btnWrapper}>
                <Button
                  title="Save"
                  icon={<BsSave className="w-5 h-5 text-white" />}
                  buttonStyles="flex items-center gap-x-2 px-4 py-2 bg-c_yellow rounded-xl text-white"
                  buttonTitleWrapperStyles="hidden sm:block"
                  type="submit"
                />
              </div>
            </form>
          </div>