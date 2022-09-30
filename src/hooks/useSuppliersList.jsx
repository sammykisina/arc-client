import { useMemo } from "react";
import { useState } from "react";
import { useRecoilState, useSetRecoilState } from "recoil";
import { SuppliersListsAPI } from "../api/suppliersListAPI";
import {
  allSuppliersFromDBState,
  globalSupplierState,
  isEditingSupplierState,
} from "../atoms/SuppliersListAtom";
import { Icon, InteractiveButton } from "../components";
import {
  AvatarCell,
  LocationFilter,
  StatusFilter,
  StatusPill,
} from "../components/ui-reusable-small-components/table";
import { Notification } from "../utils/notifications";
import { FaStar } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { RiEditCircleFill } from "react-icons/ri";
import {
  showCreateOrEditSupplierModalState,
  showDeleteSupplierModalState,
} from "../atoms/ModalAtoms";
import { HiChevronDown } from "react-icons/hi";

const useSuppliersList = () => {
  /**
   * Hook states
   */
  const [isFetchingSuppliers, setIsFetchingSuppliers] = useState(false);
  const setIsEditingSupplier = useSetRecoilState(isEditingSupplierState);
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
            Header: "# of Closed Deals",
            accessor: "number_of_closed_deals",
          },
          {
            Header: "Status",
            accessor: "status",
            Cell: StatusPill,
            Filter: StatusFilter,
            filter: "include",
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
  const [allSuppliersFromDB, setAllSuppliersFromDB] = useRecoilState(
    allSuppliersFromDBState
  );
  const supplierInputs = [
    {
      name: "name",
      label: "Supplier Name",
      errorMessage: "Enter supplier name",
      component: "Input",
      required: true,
      type: "text",
    },
    {
      name: "location",
      label: "Supplier Location",
      errorMessage: "Enter supplier location",
      component: "Input",
      required: true,
      type: "text",
    },
    {
      name: "status",
      label: "Supplier Current Status",
      errorMessage: "Choose status",
      options: [
        {
          name: "active",
          value: "active",
        },
        {
          name: "suspended",
          value: "suspended",
        },
        {
          name: "underreview",
          value: "underreview",
        },
      ],
      component: "Select",
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
  ];
  const [globalSupplier, setGlobalSupplier] =
    useRecoilState(globalSupplierState);
  const setShowDeleteSupplierModal = useSetRecoilState(
    showDeleteSupplierModalState
  );
  const setShowCreateOrEditSupplierModal = useSetRecoilState(
    showCreateOrEditSupplierModalState
  );

  /**
   * Hook functions
   */
  const getAllSuppliersFromDB = () => {
    setIsFetchingSuppliers(true);
    SuppliersListsAPI.getAll()
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
          actions: [
            <div
              className="flex gap-x-3 items-center"
              key={supplierFromDB?.attributes?.uuid}
            >
              <Icon
                icon={<MdDelete className="deleteActionButton " />}
                purpose={() => {
                  setGlobalSupplier(supplierFromDB);
                  setShowDeleteSupplierModal(true);
                }}
              />
              <Icon
                icon={<RiEditCircleFill className="editActionButton" />}
                purpose={() => {
                  setGlobalSupplier(supplierFromDB),
                    setIsEditingSupplier(true),
                    setShowCreateOrEditSupplierModal(true);
                }}
              />
            </div>,
          ],
        },
      ];
    });

    return suppliersData;
  };

  const createSupplier = (supplierData) => {
    SuppliersListsAPI.create(supplierData).then((response) => {
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
    SuppliersListsAPI.update(
      globalSupplier?.attributes?.uuid,
      supplierEditData
    ).then((response) => {
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
    });
  };

  const deleteSupplier = () => {
    SuppliersListsAPI.delete(globalSupplier?.attributes?.uuid).then(
      (response) => {
        if (response.error === 1)
          Notification.errorNotification(response.message);
        else {
          const newSuppliers = allSuppliersFromDB.filter(
            (supplierFromDB) =>
              supplierFromDB?.attributes?.uuid !=
              globalSupplier?.attributes?.uuid
          );

          setAllSuppliersFromDB(newSuppliers);
          Notification.successNotification(response.message);
        }
      }
    );
  };

  const getCurrentlyAssignedSupplierNames = () => {
    const supplierNames = new Set();

    allSuppliersFromDB?.forEach((supplierFromDB) => {
      supplierNames.add(supplierFromDB?.attributes?.name);
    });

    return [...supplierNames.values()];
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

  return {
    suppliersListTableColumn,
    getAllSuppliersFromDB,
    isFetchingSuppliers,
    getSuppliersDataForSuppliersListTable,
    getSuppliersDataForSuppliersListTable,
    supplierInputs,
    createSupplier,
    getCurrentlyAssignedSupplierNames,
    deleteSupplier,
    getSupplierEditData,
    updateSupplier,
  };
};

export default useSuppliersList;
