// react framework imports
import { useState } from "react";

// icon imports {react icons}
import { TiTick } from "react-icons/ti";

// all components imports {local and packages}
import { InteractiveButton } from "../";

const Stepper = ({ steps }) => {
  // component states
  const [currentStep, setCurrentStep] = useState(0);
  const [completed, setCompleted] = useState(false);
  const { content } = steps[currentStep];
  const lastIndex = steps.findIndex((step) => step.title === "Finish");

  return (
    <section>
      {/* the steps indicator */}
      <div className="flex justify-between">
        {steps?.map((step, stepIndex) => (
          <div
            key={stepIndex}
            className={`step_item ${
              currentStep === stepIndex && "activeStep"
            } ${(stepIndex < currentStep || completed) && "complete"}`}
          >
            <div className="step">
              {stepIndex < currentStep || completed ? (
                <TiTick />
              ) : (
                stepIndex + 1
              )}
            </div>
            <span className="text-c_gray/50">{step.title}</span>
          </div>
        ))}
      </div>

      {/* the body section of the stepper */}
      <div className="mt-4 flex items-center gap-2 justify-end h-[105px]">
        <div>{content}</div>

        <InteractiveButton
          title="Next"
          buttonWrapperStyles={`text-center py-2 px-4 bg-c_yellow rounded-full text-white w-fit text-sm ${
            currentStep === lastIndex && "hidden"
          }`}
          arrowsPosition="right"
          purpose={() => {
            currentStep === steps.length
              ? setCompleted(true)
              : setCurrentStep((previousStep) => previousStep + 1);
          }}
        />
      </div>
    </section>
  );
};

export default Stepper;
