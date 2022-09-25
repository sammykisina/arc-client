import { useCallback } from "react";

{
  /* Pagination */
}
{
  showPagination && (
    <section className="py-3 flex items-center justify-between  w-full bg-white">
      <div className="flex-1 flex justify-between sm:hidden">
        <Button
          title="Previous"
          type="button"
          purpose={() => previousPage()}
          disabled={!canPreviousPage}
        />

        <Button
          title="Next"
          type="button"
          purpose={() => previousPage()}
          disabled={!canNextPage}
        />
      </div>

      <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
        <div className="w-fit flex items-center gap-x-2 justify-center">
          <span
            className={`text-sm text-c_dark ${
              isSidebarOpen && "sm:hidden md:block"
            }`}
          >
            Page <span className="font-medium">{pageIndex + 1}</span> of{" "}
            <span className="font-medium">{pageOptions.length}</span>
          </span>

          <div>
            <span className="sr-only">Items Per Page</span>
            <select
              className="mt-1 block w-full rounded-md border-c_gray shadow-sm focus:border-c_gray px-4 py-2 bg-c_green_light  text-c_green focus:outline-none"
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
              }}
            >
              {[5, 10, 20].map((pageSize) => (
                <option key={pageSize} value={pageSize}>
                  Show {pageSize}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* page navigation */}
        <div>
          <nav
            className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
            aria-label="Pagination"
          >
            <Button
              buttonStyles="rounded-l-md page-nav"
              icon={<HiChevronDoubleLeft className="icon text-c_green" />}
              type="button"
              purpose={() => gotoPage(0)}
              disabled={!canPreviousPage}
            />

            <Button
              buttonStyles="page-nav"
              icon={<HiChevronLeft className="icon text-c_green" />}
              type="button"
              purpose={() => previousPage()}
              disabled={!canPreviousPage}
            />

            <Button
              buttonStyles="page-nav"
              icon={<HiChevronRight className="icon text-c_green" />}
              type="button"
              purpose={() => nextPage()}
              disabled={!canNextPage}
            />

            <Button
              buttonStyles="rounded-r-md page-nav"
              icon={<HiChevronDoubleRight className="icon text-c_green" />}
              type="button"
              purpose={() => gotoPage(pageCount - 1)}
              disabled={!canNextPage}
            />
          </nav>
        </div>
      </div>
    </section>
  );
}
