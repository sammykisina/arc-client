/**
 * generate a set of all product variants names created
 */
export const getCurrentAssignedProductVariantNames = (productVariants) => {
  const productVariantsNames = new Set();

  productVariants.forEach((productVariant) => {
    productVariantsNames.add(productVariant?.attributes?.name);
  });

  return [...productVariantsNames.values()];
};

/**
 * create an edit object only containing the new values that need to be edited
 * @param {*} globalProduct
 * @param {*} globalProductVariant
 * @param {*} name
 * @param {*} cost
 * @param {*} retail
 * @param {*} initial_number_of_pieces
 * @param {*} measure
 * @param {*} selectedProduct
 * @return {}
 */
export const getProductVariantEditData = (
  globalProduct,
  globalProductVariant,
  name,
  cost,
  retail,
  initial_number_of_pieces,
  measure,
  selectedProduct
) => {
  let productVariantEditData = {};
  if (globalProductVariant?.attributes?.name != name)
    productVariantEditData = { ...productVariantEditData, name: name };

  if (globalProductVariant?.attributes?.price?.cost != cost)
    productVariantEditData = { ...productVariantEditData, cost: cost };

  if (globalProductVariant?.attributes?.price?.retail != retail)
    productVariantEditData = { ...productVariantEditData, retail: retail };

  if (initial_number_of_pieces != "")
    productVariantEditData = {
      ...productVariantEditData,
      stoke: initial_number_of_pieces,
      store: initial_number_of_pieces,
    };

  if (globalProductVariant?.attributes?.measure != measure)
    productVariantEditData = { ...productVariantEditData, measure: measure };

  if (globalProduct?.id != selectedProduct.value)
    productVariantEditData = {
      ...productVariantEditData,
      product_id: selectedProduct.value,
    };

  return productVariantEditData;
};
