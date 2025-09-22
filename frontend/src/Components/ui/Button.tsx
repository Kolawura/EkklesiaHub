import { cn } from "../../utils/utils";
import { ButtonProps } from "../../Type";

export const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  type = "button",
  variant = "primary",
  className,
  disabled = false,
  ...rest
}) => {
  const baseStyles =
    "inline-flex items-center justify-center px-6 py-2 font-semibold transition-all duration-200 rounded-lg";
  const variants = {
    primary: "bg-indigo-600 text-white hover:bg-indigo-700",
    secondary: "bg-gray-800 text-white hover:bg-gray-900",
    outline:
      "border border-gray-400 text-gray-800 hover:bg-gray-100 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-800",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={cn(baseStyles, variants[variant], className)}
      {...rest}
    >
      {children}
    </button>
  );
};
