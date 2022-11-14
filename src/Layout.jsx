import { useRef } from "react";
import { BrowserRouter } from "react-router-dom";
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
  showCreateOrEditProcurementModalState,
  showDeleteProcurementModalState,
} from "./atoms/ModalAtom";
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
  CreateOrEditProcurement,
  DeleteProcurement,
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
  const showCreateOrEditProduct = useRecoilValue(showCreateOrEditProductState);
  const showCreateOrEditEmployeeModal = useRecoilValue(
    showCreateOrEditEmployeeModalState
  );
  const showCreateOrEditCategoryModal = useRecoilValue(
    showCreateOrEditCategoryModalState
  );
  const showDeleteEmployeeModal = useRecoilValue(showDeleteEmployeeModalState);
  const showDeleteCategoryModal = useRecoilValue(showDeleteCategoryModalState);
  const showDeleteProductModal = useRecoilValue(showDeleteProductModalState);
  const showCreateOrEditProductVariantModal = useRecoilValue(
    showCreateOrEditProductVariantModalState
  );
  const showDeleteProductVariantModal = useRecoilValue(
    showDeleteProductVariantModalState
  );
  const showCreateOrEditShift = useRecoilValue(showCreateOrEditShiftState);
  const showCreateOrEditOrderModal = useRecoilValue(
    showCreateOrEditOrderModalState
  );
  const showCreateOrEditTableModal = useRecoilValue(
    showCreateOrEditTableModalState
  );
  const showDeleteTableModal = useRecoilValue(showDeleteTableModalState);
  const createProductDecisionTabsIndex = useRecoilValue(
    createProductDecisionTabsIndexState
  );
  const showCreateOrEditSupplierModal = useRecoilValue(
    showCreateOrEditSupplierModalState
  );
  const showDeleteSupplierModal = useRecoilValue(showDeleteSupplierModalState);
  const showAddSupplyItemModal = useRecoilValue(showAddSupplyItemModalState);
  const showCreateOrEditProcurementModal = useRecoilValue(
    showCreateOrEditProcurementModalState
  );
  const showDeleteProcurementModal = useRecoilValue(
    showDeleteProcurementModalState
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
          component={<CreateOrEditProduct />}
        />
        {/* the delete product modal */}
        <Modal
          modalState={showDeleteProductModal}
          modalStyles="w-[90vw] h-fit"
          component={<DeleteProduct />}
        />
        {/* the create or edit employee modal */}
        <Modal
          modalState={showCreateOrEditEmployeeModal}
          modalStyles="w-[95vw] h-[500px] sm:h-[400px]"
          component={<CreateOrEditEmployee />}
        />
        {/* the delete employee modal */}
        <Modal
          modalState={showDeleteEmployeeModal}
          modalStyles="w-[90vw] h-fit"
          component={<DeleteEmployee />}
        />
        {/* the create or edit the category modal */}
        <Modal
          modalState={showCreateOrEditCategoryModal}
          modalStyles="w-[90vw] h-fit"
          component={<CreateOrEditCategory />}
        />
        {/* the delete category modal */}
        <Modal
          modalState={showDeleteCategoryModal}
          modalStyles="w-[90vw] h-fit"
          component={<DeleteCategory />}
        />
        {/* the create or edit product variant modal */}
        <Modal
          modalState={showCreateOrEditProductVariantModal}
          modalStyles="w-[95vw] h-[500px] sm:h-[400px]"
          component={<CreateOrEditProductVariant />}
        />
        {/* the delete product variant modal */}
        <Modal
          modalState={showDeleteProductVariantModal}
          modalStyles="w-[90vw] h-[300px] sm:h-[250px]"
          component={<DeleteProductVariant />}
        />
        {/* the create shift modal */}
        <Modal
          modalState={showCreateOrEditShift}
          modalStyles="w-[90vw] h-[330px] sm:h-[260px]"
          component={<CreateOrEditShift />}
        />
        {/* create or edit an order modal */}
        <Modal
          modalState={showCreateOrEditOrderModal}
          modalStyles="w-[90vw] h-[330px] sm:h-[300px]"
          component={<CreateOrEditOrder />}
        />

        {/* create or edit a table modal */}
        <Modal
          modalState={showCreateOrEditTableModal}
          modalStyles="w-[95vw] h-fit"
          component={<CreateOrEditTable />}
        />

        {/* the delete table modal */}
        <Modal
          modalState={showDeleteTableModal}
          modalStyles="w-[90vw] h-fit"
          component={<DeleteTable />}
        />

        {/* create or edit supplier modal */}
        <Modal
          modalState={showCreateOrEditSupplierModal}
          modalStyles="w-[95vw] h-[500px] sm:h-[400px]"
          component={<CreateOrEditSupplier />}
        />

        {/* the delete supplier modal */}
        <Modal
          modalState={showDeleteSupplierModal}
          modalStyles="w-[90vw] h-fit"
          component={<DeleteSupplier />}
        />

        {/* add supply item modal */}
        <Modal
          modalState={showAddSupplyItemModal}
          modalStyles="w-[90vw] h-fit"
          component={<AddSupplyItem />}
        />

        {/* create or edit procurement modal */}
        <Modal
          modalState={showCreateOrEditProcurementModal}
          modalStyles={`w-[95vw] h-[430px] sm:h-fit`}
          component={<CreateOrEditProcurement />}
        />

        {/* the delete procurement modal */}
        <Modal
          modalState={showDeleteProcurementModal}
          modalStyles="w-[90vw] h-fit"
          component={<DeleteProcurement />}
        />
      </section>
    </BrowserRouter>
  );
};

export default Layout;
