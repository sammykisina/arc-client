const useEmployee = () => {
  /**
   * Hooks states
   */
  const employeeInputs = [
    {
      name: "first_name",
      label: "Employee First Name",
      required: true,
      errorMessage: "Enter employee first name",
      component: "Input",
      type: "text",
    },
    {
      name: "last_name",
      label: "Employee Last Name",
      required: true,
      errorMessage: "Enter employee last name",
      component: "Input",
      type: "text",
    },
    {
      name: "employee_id",
      label: "Employee Work ID",
      required: true,
      errorMessage: "Enter employee work id",
      component: "Input",
      type: "text",
      gap: true,
    },
    {
      name: "password",
      label: "Employee Login Password",
      required: true,
      errorMessage: "Enter employee password",
      component: "Input",
      type: "password",
    },
    {
      required: true,
      label: "Employee Role",
      component: "Select",
      errorMessage: "Choose employee role",
      options: [
        { name: "Administrator", value: "admin" },
        { name: "Bartender", value: "bartender" },
        { name: "Waiter", value: "waiter" },
        { name: "All", value: "*" },
      ],
    },
    {
      name: "email",
      label: "Employee Email",
      required: true,
      errorMessage: "Enter employee email",
      component: "Input",
      type: "email",
      gap: true,
    },
  ];

  return { employeeInputs };
};

export default useEmployee;
