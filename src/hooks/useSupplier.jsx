import { useState, useMemo } from "react";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { SupplierAPI } from "../api/supplierAPI";
import {
  allSuppliersFromDBState,
  globalSupplierState,
  isEditingSupplierState,
} from "../atoms/SupplierAtom";
import { Button, Icon, ToolTip } from "../components";
import {
  AvatarCell,
  DeleteAction,
  EditAction,
  LocationFilter,
  StatusFilter,
  StatusPill,
} from "../components/ui-reusable-small-components/table";
import { Notification } from "../utils/notifications";
import { FaStar } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { RiEditCircleFill } from "react-icons/ri";
import {
  showAddSupplyItemModalState,
  showCreateOrEditSupplierModalState,
  showDeleteSupplierModalState,
} from "../atoms/ModalAtom";
import { HiChevronDown, HiPlus, HiPlusSm } from "react-icons/hi";
import { allProductsFromDBState } from "../atoms/ProductAtom";
import { allProductVariantsFromDBState } from "../atoms/VariantAtom";
import { supplierStatuses } from "../constants";

const useSuppliersList = () => {
  /**
   * Hook states
   */
  const [isFetchingSuppliers, setIsFetchingSuppliers] = useState(false);
  const setIsEditingSupplier = useSetRecoilState(isEditingSupplierState);
  const [allSuppliersFromDB, setAllSuppliersFromDB] = useRecoilState(
    allSuppliersFromDBState
  );
  const [globalSupplier, setGlobalSupplier] =
    useRecoilState(globalSupplierState);
  const setShowDeleteSupplierModal = useSetRecoilState(
    showDeleteSupplierModalState
  );
  const setShowCreateOrEditSupplierModal = useSetRecoilState(
    showCreateOrEditSupplierModalState
  );
  const allProductsFromDB = useRecoilValue(allProductsFromDBState);
  const allProductVariantsFromDB = useRecoilValue(
    allProductVariantsFromDBState
  );
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedSupplierSupplyItems, setSelectedSupplierSupplyItems] =
    useState([]);
  const setShowAddSupplyItemModal = useSetRecoilState(
    showAddSupplyItemModalState
  );

  const generateSupplyItems = () => {
    const supplierSupplyItems = new Set();

    allProductsFromDB
      .filter(
        (productFromDB) => productFromDB?.attributes?.form === "independent"
      )
      ?.forEach((productFromDB) => {
        supplierSupplyItems.add({
          name: productFromDB?.attributes?.name,
          value: productFromDB?.id,
          form: "Product",
        });
      });

    allProductVariantsFromDB?.forEach((productVariantFromDB) => {
      supplierSupplyItems.add({
        name:
          productVariantFromDB?.relationships?.product?.attributes?.name +
          "_" +
          productVariantFromDB?.attributes?.name +
          "_" +
          productVariantFromDB?.attributes?.measure +
          "ml",
        value: productVariantFromDB?.id,
        form: "Variant",
      });
    });

    return [...supplierSupplyItems.values()];
  };

  const supplierInputs = [
    [
      {
        name: "name",
        label: "Name",
        errorMessage: "Enter supplier name",
        component: "Input",
        required: true,
        type: "text",
      },
      {
        name: "location",
        label: "Location",
        errorMessage: "Enter supplier location",
        component: "Input",
        required: true,
        type: "text",
      },
      {
        name: "phone_number",
        label: "Supplier Phone Number",
        errorMessage: "Enter supplier phone number",
        component: "Input",
        required: true,
        type: "number",
      },
      {
        name: "email",
        label: "Supplier Email",
        errorMessage: "Enter supplier email",
        component: "Input",
        required: true,
        type: "email",
      },
    ],
    [
      {
        name: "supplier_supply_items",
        label: "Current Supplied Items",
        errorMessage: "Choose status",
        options: generateSupplyItems(),
        component: "Select",
        multiple: true,
        selected: selectedSupplierSupplyItems,
        setSelected: setSelectedSupplierSupplyItems,
        extraStyles: "hidden",
      },
      {
        name: "status",
        label: "Current Status",
        errorMessage: "Choose status",
        options: supplierStatuses,
        component: "Select",
        multiple: false,
        selected: selectedStatus,
        setSelected: setSelectedStatus,
      },
    ],
  ];

  const suppliersListTableColumn = useMemo(
    () => [
      {
        Header: () => null,
        id: "expander",
        Cell: ({ row }) => (
          <span {...row.getToggleRowExpandedProps()}>
            <Icon
              icon={
                <HiChevronDown
                  className={`icon text-c_dark hover:bg-c_green_light rounded-full duration-300 ${
                    row.isExpanded ? "" : "-rotate-90"
                  } `}
                />
              }
            />
          </span>
        ),
      },
      {
        Header: "ARC Suppliers",
        columns: [
          {
            Header: "Name",
            accessor: "name",
            Cell: AvatarCell,
            emailAccessor: "email",
          },
          {
            Header: "Location",
            accessor: "location",
            Filter: LocationFilter,
            filter: "include",
          },
          {
            Header: "Phone",
            accessor: "phone",
          },
          {
            Header: "Rating",
            accessor: "rating",
          },
          {
            Header: "Status",
            accessor: "status",
            Cell: StatusPill,
            Filter: StatusFilter,
            filter: "include",
          },
          {
            Header: "Closed Deals",
            accessor: "number_of_closed_deals",
          },
          {
            Header: "Actions",
            accessor: "actions",
          },
        ],
      },
    ],
    []
  );

  const supplierSuppliedProductsColumn = useMemo(
    () => [
      {
        Header: "Supplied Products",
        columns: [
          {
            Header: "Name",
            accessor: "name",
          },
          {
            Header: "Retail (SP)",
            accessor: "retail",
          },
          {
            Header: "Measure",
            accessor: "measure",
          },
          {
            Header: "Action",
            accessor: "action",
          },
        ],
      },
    ],
    []
  );

  const supplierSuppliedVariantsColumn = useMemo(
    () => [
      {
        Header: "Supplied Variants",
        columns: [
          {
            Header: "Name",
            accessor: "name",
          },
          {
            Header: "Retail (SP)",
            accessor: "retail",
          },
          {
            Header: "Measure",
            accessor: "measure",
          },
          {
            Header: "Action",
            accessor: "action",
          },
        ],
      },
    ],
    []
  );

  /**
   * Hook functions
   */

  const getAllSuppliersFromDB = () => {
    setIsFetchingSuppliers(true);
    SupplierAPI.getAll()
      .then((suppliers) => setAllSuppliersFromDB(suppliers))
      .finally(() => setIsFetchingSuppliers(false));
  };

  const getSuppliersDataForSuppliersListTable = () => {
    let suppliersData = [];

    allSuppliersFromDB?.forEach((supplierFromDB) => {
      suppliersData = [
        ...suppliersData,
        {
          name: supplierFromDB?.attributes?.name,
          email: supplierFromDB?.attributes?.contact_info?.email,
          phone: supplierFromDB?.attributes?.contact_info?.phone_number,
          location: supplierFromDB?.attributes?.contact_info?.location,
          number_of_closed_deals:
            supplierFromDB?.attributes?.number_of_closed_deals,
          rating: (
            <div className="flex gap-1">
              {Array(5)
                .fill(0)
                .map((_, ratingIndex) => (
                  <Icon
                    key={ratingIndex}
                    icon={
                      <FaStar
                        className={`${
                          supplierFromDB?.attributes?.rates > ratingIndex
                            ? "text-yellow-500"
                            : "text-c_gray"
                        }`}
                      />
                    }
                  />
                ))}
            </div>
          ),
          status: supplierFromDB?.attributes?.status,
          variants: supplierFromDB?.relationships?.variants,
          products: supplierFromDB?.relationships?.products,
          actions: [
            <div
              className="flex gap-x-3 items-center"
              key={supplierFromDB?.attributes?.uuid}
            >
              <DeleteAction
                purpose={() => {
                  setGlobalSupplier(supplierFromDB);
                  setShowDeleteSupplierModal(true);
                }}
              />
              <EditAction
                purpose={() => {
                  setGlobalSupplier(supplierFromDB),
                    setIsEditingSupplier(true),
                    setShowCreateOrEditSupplierModal(true);
                }}
              />
              <ToolTip
                component={
                  <Button
                    icon={<HiPlusSm className="w-6 h-6 text-c_yellow" />}
                    purpose={() => {
                      setGlobalSupplier(supplierFromDB),
                        setShowAddSupplyItemModal(true);
                    }}
                  />
                }
                tipTitle="Items"
              />
            </div>,
          ],
        },
      ];
    });

    return suppliersData;
  };

  const createSupplier = (supplierData) => {
    SupplierAPI.create(supplierData).then((response) => {
      if (response.error === 1)
        Notification.errorNotification(response.message);
      else {
        setAllSuppliersFromDB([
          {
            ...response.supplier,
            attributes: {
              ...response.supplier?.attributes,
              rates: 0,
              number_of_closed_deals: 0,
            },
          },
          ...allSuppliersFromDB,
        ]);
      }
    });
  };

  const updateSupplier = (supplierEditData, newData) => {
    SupplierAPI.update(globalSupplier?.attributes?.uuid, supplierEditData).then(
      (response) => {
        console.log("response", response);
        if (response.error === 1)
          Notification.errorNotification(response.message);
        else {
          const supplierBeingEdited = allSuppliersFromDB.find(
            (supplierFromDB) =>
              globalSupplier?.attributes?.uuid ===
              supplierFromDB?.attributes?.uuid
          );

          const newUpdatedSuppliers = allSuppliersFromDB.map((supplierFromDB) =>
            supplierFromDB?.attributes?.uuid ===
            supplierBeingEdited?.attributes?.uuid
              ? {
                  ...supplierBeingEdited,
                  attributes: {
                    ...supplierBeingEdited?.attributes,
                    name: newData.name,
                    status: newData.selectedStatus.value,
                    contact_info: {
                      location: newData.location,
                      phone_number: newData.phone_number,
                      email: newData.email,
                    },
                  },
                }
              : supplierFromDB
          );

          setAllSuppliersFromDB(newUpdatedSuppliers);
          Notification.successNotification(response.message);
        }

        setIsEditingSupplier(false);
        setGlobalSupplier(null);
      }
    );
  };

  const addSupplierSupplyItems = (selectedSupplierSupplyItems) => {
    SupplierAPI.update(globalSupplier?.attributes?.uuid, {
      items: selectedSupplierSupplyItems,
      type: "update_supplier_supply_items",
    }).then((response) => {
      if (response.error === 1)
        Notification.errorNotification(response.message);
      else {
        const newSuppliers = allSuppliersFromDB.map((supplierFromDB) =>
          supplierFromDB?.attributes?.uuid === globalSupplier?.attributes?.uuid
            ? response?.supplier
            : supplierFromDB
        );

        setAllSuppliersFromDB(newSuppliers);
        Notification.successNotification(response.message);
      }

      setGlobalSupplier(null);
    });
  };

  const removeSupplierSupplyItem = (
    supplierId,
    supplyItemId,
    supplyItemForm
  ) => {
    SupplierAPI.delete({
      supplier_id: supplierId,
      item_id: supplyItemId,
      item_form: supplyItemForm,
      type: "delete_supplier_supply_item",
    }).then((response) => {
      if (response.error === 1)
        Notification.errorNotification(response.message);
      else {
        console.log("allSuppliersFromDB", allSuppliersFromDB);
        const newSuppliers = allSuppliersFromDB.map((supplierFromDB) =>
          supplierFromDB?.id === supplierId
            ? response?.supplier
            : supplierFromDB
        );

        setAllSuppliersFromDB(newSuppliers);

        Notification.successNotification(response.message);
      }
    });
  };

  const deleteSupplier = () => {
    SupplierAPI.delete({
      supplier_id: globalSupplier?.id,
      type: "delete_supplier",
    }).then((response) => {
      if (response.error === 1)
        Notification.errorNotification(response.message);
      else {
        const newSuppliers = allSuppliersFromDB.filter(
          (supplierFromDB) =>
            supplierFromDB?.attributes?.uuid != globalSupplier?.attributes?.uuid
        );
        setAllSuppliersFromDB(newSuppliers);
        Notification.successNotification(response.message);
      }
    });
  };

  const getCurrentlyCreatedSuppliers = () => {
    const suppliers = new Set();

    allSuppliersFromDB?.forEach((supplierFromDB) => {
      suppliers.add({
        name: supplierFromDB?.attributes?.name.toLowerCase(),
        value: supplierFromDB?.id,
        items: generateSupplierSuppliedItems(supplierFromDB),
      });
    });

    return [...suppliers.values()];
  };

  const generateSupplierSuppliedItems = (supplier) => {
    const items = new Set();
    // "form" => ProcurementItemForms::box()->label,
    // "form_quantity" => 2,

    supplier?.relationships?.variants?.forEach((variant) => {
      items.add({
        name:
          variant?.relationships?.product?.attributes?.name +
          "_" +
          variant?.attributes?.name +
          "_" +
          variant?.attributes?.measure +
          "ml",
        value: variant?.id,
        type: "Variant",
        measure: variant?.attributes?.measure,
      });
    });

    supplier?.relationships?.products?.forEach((product) => {
      items.add({
        name: product?.attributes?.name,
        value: product?.id,
        type: "Product",
        measure: product?.attributes?.measure,
      });
    });

    return [...items.values()];
  };

  const getSupplierEditData = (newData) => {
    let supplierEditData = {};

    if (globalSupplier?.attributes?.name != newData.name)
      supplierEditData = { ...supplierEditData, name: newData.name };

    if (globalSupplier?.attributes?.contact_info?.location != newData.location)
      supplierEditData = { ...supplierEditData, location: newData.location };

    if (
      globalSupplier?.attributes?.contact_info?.phone_number !=
      newData.phone_number
    )
      supplierEditData = {
        ...supplierEditData,
        phone_number: newData.phone_number,
      };

    if (globalSupplier?.attributes?.contact_info?.email != newData.email)
      supplierEditData = { ...supplierEditData, email: newData.email };

    if (globalSupplier?.attributes?.status != newData.selectedStatus.value)
      supplierEditData = {
        ...supplierEditData,
        status: newData.selectedStatus.value,
      };

    return supplierEditData;
  };

  const getSupplierSuppliedProductsDataForSuppliedProductsTable = (
    suppliedProducts,
    supplierId
  ) => {
    let suppliedProductsData = [];

    suppliedProducts?.forEach((suppliedProduct) => {
      suppliedProductsData = [
        ...suppliedProductsData,
        {
          name: suppliedProduct?.attributes?.name,
          uuid: suppliedProduct?.attributes?.uuid,
          retail: suppliedProduct?.attributes?.price?.retail,
          measure: suppliedProduct?.attributes?.measure,
          action: (
            <DeleteAction
              purpose={() => {
                removeSupplierSupplyItem(
                  supplierId,
                  suppliedProduct?.id,
                  "Product"
                );
              }}
            />
          ),
        },
      ];
    });

    return suppliedProductsData;
  };

  const getSupplierSuppliedVariantsDataForSuppliedVariantTable = (
    suppliedVariants,
    supplierId
  ) => {
    let suppliedVariantsData = [];

    suppliedVariants?.forEach((suppliedVariant) => {
      suppliedVariantsData = [
        ...suppliedVariantsData,
        {
          name:
            suppliedVariant?.relationships?.product?.attributes?.name +
            " " +
            suppliedVariant?.attributes?.name,
          uuid: suppliedVariant?.attributes?.uuid,
          retail: suppliedVariant?.attributes?.price?.retail,
          measure: suppliedVariant?.attributes?.measure,
          action: (
            <DeleteAction
              purpose={() => {
                removeSupplierSupplyItem(
                  supplierId,
                  suppliedVariant?.id,
                  "Variant"
                );
              }}
            />
          ),
        },
      ];
    });

    return suppliedVariantsData;
  };

  return {
    suppliersListTableColumn,
    getAllSuppliersFromDB,
    isFetchingSuppliers,
    getSuppliersDataForSuppliersListTable,
    supplierInputs,
    createSupplier,
    getCurrentlyCreatedSuppliers,
    deleteSupplier,
    getSupplierEditData,
    updateSupplier,
    generateSupplyItems,
    selectedStatus,
    setSelectedStatus,
    selectedSupplierSupplyItems,
    addSupplierSupplyItems,
    getSupplierSuppliedProductsDataForSuppliedProductsTable,
    supplierSuppliedProductsColumn,
    getSupplierSuppliedVariantsDataForSuppliedVariantTable,
    supplierSuppliedVariantsColumn,
  };
};

export default useSuppliersList;
