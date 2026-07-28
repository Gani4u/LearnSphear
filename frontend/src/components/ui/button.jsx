import * as React from "react";
import { cn } from "../../lib/util";

export function Button({ className, variant = "default", ...props }) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-xl px-5 py-2.5 text-sm font-semibold transition-all duration-200",
        "shadow-md hover:shadow-lg active:scale-95",

        variant === "default" &&
          "bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:opacity-90",

        variant === "secondary" &&
          "bg-gray-100 text-gray-800 hover:bg-gray-200",

        className
      )}
      {...props}
    />
  );
}