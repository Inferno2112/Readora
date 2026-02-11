import React, { useId } from "react";
import { cn } from "@/lib/utils";

const Input = React.forwardRef(function Input(
  { label, type = "text", className = "", ...props },
  ref
) {
  const id = useId();
  return (
    <div className="w-full">
      {label && (
        <label className="inline-block mb-1 pl-1" htmlFor={id}>
          {label}
        </label>
      )}
      <input
        type={type}
        className={cn(
          "px-3 py-2 rounded-lg outline-none duration-200 border w-full",
          "bg-white text-black border-gray-200 focus:bg-gray-50",
          className
        )}
        ref={ref}
        {...props}
        id={id}
      />
    </div>
  );
});

export default Input