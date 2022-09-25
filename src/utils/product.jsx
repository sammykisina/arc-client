/**
 * generate a set of all product  names created
 */
export const getCurrentAssignedProductNames = (products) => {
  const productNames = new Set();

  products?.forEach((product) => {
    productNames.add(product?.attributes?.name);
  });

  return [...productNames.values()];
};

/**
 * create an edit object only containing the new values that need to be edited
 *
 * @param {*} globalProduct
 * @param {*} name
 * @param {*} cost
 * @param {*} retail
 * @param {*} initial_number_of_pieces
 * @param {*} measure
 * @param {*} selectedCategory
 * @param {*} isCreatingProductWithVariants
 * @returns {}
 */
export const getProductEditData = (
  globalProduct,
  name,
  cost,
  retail,
  initial_number_of_pieces,
  measure,
  selectedCategory,
  allowVAT,
  isCreatingProductWithVariants
) => {
  let productEditData = {};

  isCreatingProductWithVariants
    ? (productEditData = getProductWithVariantEditData(
        globalProduct,
        name,
        selectedCategory
      ))
    : (productEditData = getProductWithoutVariantEditData(
        globalProduct,
        name,
        cost,
        retail,
        initial_number_of_pieces,
        measure,
        selectedCategory,
        allowVAT
      ));

  return productEditData;
};

/**
 * @param {*} globalProduct
 * @param {*} name
 * @param {*} selectedCategory
 * @returns {}
 */
const getProductWithVariantEditData = (
  globalProduct,
  name,
  selectedCategory
) => {
  let productWithVariantEditData = {};
  if (globalProduct?.attributes?.name != name)
    productWithVariantEditData = { ...productWithVariantEditData, name: name };

  if (globalProduct?.relationships?.category?.id != selectedCategory.value)
    productWithVariantEditData = {
      ...productWithVariantEditData,
      category_id: selectedCategory.value,
    };
  return productWithVariantEditData;
};

/**
 * @param {*} globalProduct
 * @param {*} name
 * @param {*} cost
 * @param {*} retail
 * @param {*} initial_number_of_pieces
 * @param {*} measure
 * @param {*} selectedCategory
 */
const getProductWithoutVariantEditData = (
  globalProduct,
  name,
  cost,
  retail,
  initial_number_of_pieces,
  measure,
  selectedCategory,
  allowVAT
) => {
  let productWithoutVariantEditData = {};
  if (globalProduct?.attributes?.name != name)
    productWithoutVariantEditData = {
      ...productWithoutVariantEditData,
      name: name,
    };

  if (globalProduct?.attributes?.price?.cost != cost)
    productWithoutVariantEditData = {
      ...productWithoutVariantEditData,
      cost: cost,
    };

  if (globalProduct?.attributes?.price?.retail != retail)
    productWithoutVariantEditData = {
      ...productWithoutVariantEditData,
      retail: retail,
    };

  if (initial_number_of_pieces !== "") {
    productWithoutVariantEditData = {
      ...productWithoutVariantEditData,
      stock: initial_number_of_pieces,
      store: initial_number_of_pieces,
    };
  }

  if (globalProduct?.attributes?.measure != measure)
    productWithoutVariantEditData = {
      ...productWithoutVariantEditData,
      measure: measure,
    };

  if (globalProduct?.relationships?.category?.id != selectedCategory.value)
    productWithoutVariantEditData = {
      ...productWithoutVariantEditData,
      category_id: selectedCategory.value,
    };

  if (globalProduct?.attributes?.vat !== allowVAT)
    productWithoutVariantEditData = {
      ...productWithoutVariantEditData,
      vat: allowVAT,
    };

  return productWithoutVariantEditData;
};
