"use client";

import React, { ReactElement, useState } from "react";

interface SelectProps {
  value: string;
  onValueChange: (value: string) => void;
  children: React.ReactNode;
}

interface SelectTriggerProps {
  children: React.ReactNode;
  className?: string;
}

interface SelectContentProps {
  children: React.ReactNode;
}

interface SelectItemProps {
  value: string;
  children: React.ReactNode;
  onSelect?: (value: string) => void;
  isSelected?: boolean;
}

interface SelectValueProps {
  placeholder?: string;
}

export const Select: React.FC<SelectProps> = ({
  value,
  onValueChange,
  children,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative bg-gray-50 dark:bg-gray-900">
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          if (child.type === SelectTrigger) {
            return React.cloneElement(child, {
              onClick: () => setIsOpen(!isOpen),
              isOpen,
            } as any);
          }
          if (child.type === SelectContent) {
            return isOpen
              ? React.cloneElement(child, {
                  onSelect: (selectedValue: string) => {
                    onValueChange(selectedValue);
                    setIsOpen(false);
                  },
                  currentValue: value,
                } as any)
              : null;
          }
        }
        return child;
      })}
    </div>
  );
};

export const SelectTrigger: React.FC<
  SelectTriggerProps & { onClick?: () => void; isOpen?: boolean }
> = ({ children, className = "", onClick, isOpen }) => (
  <button
    type="button"
    onClick={onClick}
    className={`flex h-10 w-full items-center justify-between rounded-md bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 px-3 py-2 text-sm placeholder:text-gray-500 dark:placeholder:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
  >
    {children}
    <svg
      className={`h-4 w-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M19 9l-7 7-7-7"
      />
    </svg>
  </button>
);

export const SelectContent: React.FC<
  SelectContentProps & {
    onSelect?: (value: string) => void;
    currentValue?: string;
  }
> = ({ children, onSelect, currentValue }) => (
  <div className="absolute top-full left-0 right-0 z-50 mt-1 max-h-60 overflow-auto rounded-md bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 shadow-lg">
    {React.Children.map(children, (child) => {
      if (
        React.isValidElement<SelectItemProps>(child) &&
        child.type === SelectItem
      ) {
        return React.cloneElement(child, {
          onSelect,
          isSelected: child.props.value === currentValue,
        });
      }
      return child;
    })}
  </div>
);

export const SelectItem: React.FC<
  SelectItemProps & { onSelect?: (value: string) => void; isSelected?: boolean }
> = ({ value, children, onSelect, isSelected }) => (
  <div
    className={`cursor-pointer px-3 py-2 text-sm bg-white dark:bg-white/3 hover:bg-gray-100 dark:hover:bg-gray-900 ${
      isSelected ? "bg-blue-50 text-blue-600" : ""
    }`}
    onClick={() => onSelect?.(value)}
  >
    {children}
  </div>
);

export const SelectValue: React.FC<SelectValueProps> = ({ placeholder }) => (
  <span className="text-gray-500">{placeholder}</span>
);
