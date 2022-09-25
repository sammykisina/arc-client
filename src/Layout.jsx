import React, { useRef } from "react";
import { BrowserRouter } from "react-router-dom";
import { CgClose } from "react-icons/cg";
import { useRecoilValue, useRecoilState } from "recoil";
import {
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
  showCreateOrEditTableModalState,
  showDeleteEmployeeModalState,
  showDeleteProductModalState,
  showDeleteProductVariantModalState,
  showDeleteTableModalState,
} from "./atoms/ModalAtoms";
import { showDeleteCategoryModalState } from "./atoms/CategoryAtom";
import { isEditingProductState } from "./atoms/ProductAtom";
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
  const isEditingProduct = useRecoilValue(isEditingProductState);
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
          className={`p-2 flex-1 h-screen duration-300 max-w-[1200px] overflow-x-scroll scrollbar-hide  ${
            isSidebarOpen ? "sm:ml-[200px]" : "sm:ml-24"
          }`}
        >
          <TopHeader />
          <div className="mt-5">
            <AppRoutes />
          </div>
        </div>
        {/* the modals */}
        {/* the add product modal */}
        <Modal
          modalState={showCreateOrEditProduct}
          modalStyles={`${
            isEditingProduct
              ? "h-[460px] sm:h-[350px]"
              : "h-[500px] sm:h-[400px]"
          } w-[95vw]`}
          closeIcon={<CgClose className={`w-5 h-5 text-c_green`} />}
          close={() => setShowCreateOrEditProduct(false)}
          component={<CreateOrEditProduct />}
        />
        {/* the delete product modal */}
        <Modal
          modalState={showDeleteProductModal}
          modalStyles="w-[90vw] h-[330px] sm:h-[300px]"
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
          modalStyles="w-[90vw] h-[300px]"
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
          modalStyles="w-[90vw] h-[300px]"
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
          modalStyles="w-[90vw] h-[330px] sm:h-[300px]"
          closeIcon={<CgClose className={`w-5 h-5 text-c_green`} />}
          close={() => setShowDeleteProductVariantModal(false)}
          component={<DeleteProductVariant />}
        />
        {/* the create shift modal */}
        <Modal
          modalState={showCreateOrEditShift}
          modalStyles="w-[90vw] h-[330px] sm:h-[300px]"
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

        {/* the delete category modal */}
        <Modal
          modalState={showDeleteTableModal}
          modalStyles="w-[90vw] h-[300px]"
          closeIcon={<CgClose className={`w-5 h-5 text-c_green`} />}
          close={() => setShowDeleteTableModal(false)}
          component={<DeleteTable />}
        />
      </section>
    </BrowserRouter>
  );
};

export default Layout;
