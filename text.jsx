<section className="relative">
  {/* title */}
  <Title title={isEditingEmployee ? "Edit Employee" : "Create an Employee."} />

  <Line lineStyles="bg-c_yellow/100 w-[25px] h-[5px] rounded-full" />
  {/* fields */}
  <form className={formStyles} onSubmit={handleSubmit(onSubmit)}>
    {employeeInputs.map((employeeInput, employeeInputIndex) => (
      <div
        key={employeeInputIndex}
        className={`h-fit ${employeeInput.gap && "mt-5 sm:mt-0 "}`}
      >
        {employeeInput.component === "Input" ? (
          <div className="input-group w-[250px] sm:w-[220px] md:w-[240px]">
            <input
              type={employeeInput.type}
              placeholder=""
              {...register(employeeInput.name, { required: true })}
              className="input"
            />

            <label className="placeholder">{employeeInput.label}</label>

            {errors[employeeInput.name] && (
              <span className="error">{employeeInput.errorMessage}</span>
            )}
          </div>
        ) : (
          <div className="input-group w-[250px] sm:w-[220px] md:w-[240px]">
            <div className="input">
              <Select
                title="-"
                options={employeeInput.options}
                selected={selectedRole}
                setSelected={setSelectedRole}
              />
            </div>

            <label className="placeholder">{employeeInput.label}</label>
          </div>
        )}
      </div>
    ))}

    <div className={btnWrapper}>
      <Button
        title="Save"
        type="submit"
        icon={<BsSave className="w-5 h-5 text-white" />}
        buttonStyles="primaryButton"
        buttonTitleWrapperStyles="hidden sm:block"
      />
    </div>
  </form>
</section>;
