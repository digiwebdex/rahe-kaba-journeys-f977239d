import { Check } from "lucide-react";

interface Step {
  label: string;
  icon: React.ReactNode;
}

interface Props {
  steps: Step[];
  currentStep: number;
}

const BookingStepIndicator = ({ steps, currentStep }: Props) => {
  return (
    <div className="flex items-center justify-center gap-1 mb-10">
      {steps.map((step, i) => {
        const isCompleted = i < currentStep;
        const isCurrent = i === currentStep;
        return (
          <div key={step.label} className="flex items-center">
            <div className="flex flex-col items-center gap-1.5">
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
                  isCompleted
                    ? "bg-primary text-primary-foreground"
                    : isCurrent
                    ? "bg-gradient-gold text-primary-foreground shadow-gold"
                    : "bg-secondary text-muted-foreground"
                }`}
              >
                {isCompleted ? <Check className="h-4 w-4" /> : i + 1}
              </div>
              <span
                className={`text-xs font-medium hidden sm:block ${
                  isCurrent ? "text-primary" : "text-muted-foreground"
                }`}
              >
                {step.label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div
                className={`w-8 md:w-16 h-0.5 mx-1 mt-[-18px] sm:mt-[-18px] ${
                  i < currentStep ? "bg-primary" : "bg-border"
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
};

export default BookingStepIndicator;
