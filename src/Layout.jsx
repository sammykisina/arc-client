import React, { useRef } from "react";
import { BrowserRouter } from "react-router-dom";
import { CgClose } from "react-icons/cg";
import { useRecoilValue, useRecoilState } from "recoil";
import {
  createProductDecisionTabsIndexState,
  currentUserRoleState,
  currentUserTokenState,
  isSidebarOpenState,
  showSidebarState,
} from "./atoms/AppAtoms";
import {
  showCreateOrEditCategoryModalState,
  showCreateOrEditEmployeeModalState,
  showCreateOrEditOrderModalState,
  showCreateOrEditProductState,
  showCreateOrEditProductVariantModalState,
  showCreateOrEditShiftState,
  showCreateOrEditSupplierModalState,
  showCreateOrEditTableModalState,
  showAddSupplyItemModalState,
  showDeleteCategoryModalState,
  showDeleteEmployeeModalState,
  showDeleteProductModalState,
  showDeleteProductVariantModalState,
  showDeleteSupplierModalState,
  showDeleteTableModalState,
} from "./atoms/ModalAtoms";
import {
  Sidebar,
  TopHeader,
  Modal,
  CreateOrEditEmployee,
  DeleteEmployee,
  CreateOrEditCategory,
  DeleteCategory,
  CreateOrEditProduct,
  DeleteProduct,
  CreateOrEditProductVariant,
  DeleteProductVariant,
  CreateOrEditOrder,
  CreateOrEditTable,
  DeleteTable,
  CreateOrEditSupplier,
  DeleteSupplier,
  AddSupplyItem,
} from "./components";
import AppRoutes from "./routes/AppRoutes";
import { useClickOutside } from "react-haiku";
import { Login } from "./pages";
import { Toaster } from "react-hot-toast";
import CreateOrEditShift from "./components/modal/modalComponents/CreateOrEditShift";

const Layout = () => {
  // component states
  const isSidebarOpen = useRecoilValue(isSidebarOpenState);
  const [showSidebar, setShowSidebar] = useRecoilState(showSidebarState);
  const sidebarRef = useRef(null);
  const currentUserToken = useRecoilValue(currentUserTokenState);
  const currentUserRole = useRecoilValue(currentUserRoleState);

  /**
   * modal states
   */
  const [showCreateOrEditProduct, setShowCreateOrEditProduct] = useRecoilState(
    showCreateOrEditProductState
  );
  const [showCreateOrEditEmployeeModal, setShowCreateOrEditEmployeeModal] =
    useRecoilState(showCreateOrEditEmployeeModalState);

  const [showCreateOrEditCategoryModal, setShowCreateOrEditCategoryModal] =
    useRecoilState(showCreateOrEditCategoryModalState);

  const [showDeleteEmployeeModal, setShowDeleteEmployeeModal] = useRecoilState(
    showDeleteEmployeeModalState
  );

  const [showDeleteCategoryModal, setShowDeleteCategoryModal] = useRecoilState(
    showDeleteCategoryModalState
  );

  const [showDeleteProductModal, setShowDeleteProductModal] = useRecoilState(
    showDeleteProductModalState
  );

  const [
    showCreateOrEditProductVariantModal,
    setShowCreateOrEditProductVariantModal,
  ] = useRecoilState(showCreateOrEditProductVariantModalState);

  const [showDeleteProductVariantModal, setShowDeleteProductVariantModal] =
    useRecoilState(showDeleteProductVariantModalState);

  const [showCreateOrEditShift, setShowCreateOrEditShift] = useRecoilState(
    showCreateOrEditShiftState
  );

  const [showCreateOrEditOrderModal, setShowCreateOrEditOrderModal] =
    useRecoilState(showCreateOrEditOrderModalState);

  const [showCreateOrEditTableModal, setShowCreateOrEditTableModal] =
    useRecoilState(showCreateOrEditTableModalState);

  const [showDeleteTableModal, setShowDeleteTableModal] = useRecoilState(
    showDeleteTableModalState
  );
  const createProductDecisionTabsIndex = useRecoilValue(
    createProductDecisionTabsIndexState
  );
  const [showCreateOrEditSupplierModal, setShowCreateOrEditSupplierModal] =
    useRecoilState(showCreateOrEditSupplierModalState);

  const [showDeleteSupplierModal, setShowDeleteSupplierModal] = useRecoilState(
    showDeleteSupplierModalState
  );

  const [showAddSupplyItemModal, setShowAddSupplyItemModal] = useRecoilState(
    showAddSupplyItemModalState
  );

  // component functions

  /**
   * close the sidebar if user clicks outside it
   */
  const handleClickOutside = () => setShowSidebar(false);
  useClickOutside(sidebarRef, handleClickOutside);

  /**
   * redirect to Login page if the user does not have a authentication token stored in  the local storage
   */
  if (!currentUserToken) return <Login />;

  /**
   * Main return for authenticated users
   * (functionalities are either active, inactive or hidden depending on the current user role)
   */
  return (
    <BrowserRouter>
      <section className="flex bg-white relative w-full max-w-[1200px] mx-auto sm:px-[20px]">
        {/* the Toaster */}
        <Toaster />
        {/* the sidebar */}
        <div
          className={` absolute sm:left-0 duration-300  ${
            showSidebar ? "left-0" : "-left-[100%]"
          }`}
          ref={sidebarRef}
        >
          <Sidebar />
        </div>
        {/* the rest of the body */}
        <div
          className={`p-2 flex-1 h-fit sm:h-screen duration-300 max-w-[1200px] overflow-x-scroll scrollbar-hide ${
            isSidebarOpen ? "sm:ml-[200px]" : "sm:ml-24"
          }`}
        >
          <TopHeader />
          <div className="mt-5">
            <AppRoutes />
          </div>
        </div>
        {/* the modals */}
        {/* the create or edit product modal */}
        <Modal
          modalState={showCreateOrEditProduct}
          modalStyles={`duration-300 ${
            createProductDecisionTabsIndex === 0
              ? "h-[460px] sm:h-[350px]"
              : "h-[350px] sm:h-[290px]"
          } w-[95vw]`}
          closeIcon={<CgClose className={`w-5 h-5 text-c_green`} />}
          close={() => setShowCreateOrEditProduct(false)}
          component={<CreateOrEditProduct />}
        />
        {/* the delete product modal */}
        <Modal
          modalState={showDeleteProductModal}
          modalStyles="w-[90vw] h-[280px] sm:h-[250px]"
          closeIcon={<CgClose className={`w-5 h-5 text-c_green`} />}
          close={() => setShowDeleteProductModal(false)}
          component={<DeleteProduct />}
        />
        {/* the create employee modal */}
        <Modal
          modalState={showCreateOrEditEmployeeModal}
          modalStyles="w-[95vw] h-[500px] sm:h-[400px]"
          closeIcon={<CgClose className={`w-5 h-5 text-c_green`} />}
          close={() => setShowCreateOrEditEmployeeModal(false)}
          component={<CreateOrEditEmployee />}
        />
        {/* the delete employee modal */}
        <Modal
          modalState={showDeleteEmployeeModal}
          modalStyles="w-[90vw] h-[280px] sm:h-[250px]"
          closeIcon={<CgClose className={`w-5 h-5 text-c_green`} />}
          close={() => setShowDeleteEmployeeModal(false)}
          component={<DeleteEmployee />}
        />
        {/* the create or edit the category modal */}
        <Modal
          modalState={showCreateOrEditCategoryModal}
          modalStyles="w-[90vw] h-[350px] sm:h-[350px]"
          closeIcon={<CgClose className={`w-5 h-5 text-c_green`} />}
          close={() => setShowCreateOrEditCategoryModal(false)}
          component={<CreateOrEditCategory />}
        />
        {/* the delete category modal */}
        <Modal
          modalState={showDeleteCategoryModal}
          modalStyles="w-[90vw] h-[300px] sm:h-[250px]"
          closeIcon={<CgClose className={`w-5 h-5 text-c_green`} />}
          close={() => setShowDeleteCategoryModal(false)}
          component={<DeleteCategory />}
        />
        {/* the create or edit product variant modal */}
        <Modal
          modalState={showCreateOrEditProductVariantModal}
          modalStyles="w-[95vw] h-[500px] sm:h-[400px]"
          closeIcon={<CgClose className={`w-5 h-5 text-c_green`} />}
          close={() => setShowCreateOrEditProductVariantModal(false)}
          component={<CreateOrEditProductVariant />}
        />
        {/* the delete product variant modal */}
        <Modal
          modalState={showDeleteProductVariantModal}
          modalStyles="w-[90vw] h-[300px] sm:h-[250px]"
          closeIcon={<CgClose className={`w-5 h-5 text-c_green`} />}
          close={() => setShowDeleteProductVariantModal(false)}
          component={<DeleteProductVariant />}
        />
        {/* the create shift modal */}
        <Modal
          modalState={showCreateOrEditShift}
          modalStyles="w-[90vw] h-[330px] sm:h-[260px]"
          closeIcon={<CgClose className={`w-5 h-5 text-c_green`} />}
          close={() => setShowCreateOrEditShift(false)}
          component={<CreateOrEditShift />}
        />
        {/* create or edit an order modal */}
        <Modal
          modalState={showCreateOrEditOrderModal}
          modalStyles="w-[90vw] h-[330px] sm:h-[300px]"
          closeIcon={<CgClose className={`w-5 h-5 text-c_green`} />}
          close={() => setShowCreateOrEditOrderModal(false)}
          component={<CreateOrEditOrder />}
        />

        {/* create or edit a table modal */}
        <Modal
          modalState={showCreateOrEditTableModal}
          modalStyles="w-[95vw] h-[420px] sm:h-[365px]"
          closeIcon={<CgClose className={`w-5 h-5 text-c_green`} />}
          close={() => setShowCreateOrEditTableModal(false)}
          component={<CreateOrEditTable />}
        />

        {/* the delete table modal */}
        <Modal
          modalState={showDeleteTableModal}
          modalStyles="w-[90vw] h-[280px] sm:h-[250px]"
          closeIcon={<CgClose className={`w-5 h-5 text-c_green`} />}
          close={() => setShowDeleteTableModal(false)}
          component={<DeleteTable />}
        />

        {/* create or edit supplier modal */}
        <Modal
          modalState={showCreateOrEditSupplierModal}
          modalStyles="w-[95vw] h-[500px] sm:h-[400px]"
          closeIcon={<CgClose className={`w-5 h-5 text-c_green`} />}
          close={() => setShowCreateOrEditSupplierModal(false)}
          component={<CreateOrEditSupplier />}
        />

        {/* the delete supplier modal */}
        <Modal
          modalState={showDeleteSupplierModal}
          modalStyles="w-[90vw] h-[280px] sm:h-[250px]"
          closeIcon={<CgClose className={`w-5 h-5 text-c_green`} />}
          close={() => setShowDeleteSupplierModal(false)}
          component={<DeleteSupplier />}
        />

        {/* create supply item modal */}
        <Modal
          modalState={showAddSupplyItemModal}
          modalStyles="w-[90vw] h-[250px]"
          closeIcon={<CgClose className={`w-5 h-5 text-c_green`} />}
          close={() => setShowAddSupplyItemModal(false)}
          component={<AddSupplyItem />}
        />
      </section>
    </BrowserRouter>
  );
};

export default Layout;
