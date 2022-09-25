/**
 * return all currently assigned category names
 */
export const getCurrentAssignedCategoryNames = (categories) => {
  const categoriesNames = new Set();

  categories?.forEach((category) => {
    categoriesNames.add(category?.attributes?.name);
  });

  return [...categoriesNames.values()];
};

/**
 * create an edit object only containing the new values that need to be edited
 */
export const getCategoryData = (globalCategory, name, description) => {
  let editData = {};

  if (globalCategory?.attributes?.name != name)
    editData = { ...editData, name: name };

  if (globalCategory?.attributes?.description != description)
    editData = { ...editData, description: name };

  return editData;
};
