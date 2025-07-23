import { clsx, type ClassValue } from "clsx"; // ClassValue is a type only
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs)); // clsx returns a string
}

// all type of inputs that cn can accept:
/* cn(
  "p-4", // string
  ["text-white", "rounded"], // array
  { "bg-red-500": isActive, hidden: !isVisible }, // object
  undefined, // safely ignored
  null, // safely ignored
  0, // number, ignored
  false // boolean, ignored
);

about input received by clsx function:-
... (Spread)	Accept multiple, individual arguments
inputs	The collected array of all arguments
ClassValue[]	Each argument must be of type ClassValue (string, number, array, object, boolean, null, undefined)

example:-  cn("p-4", "text-white", "p-2", { "bg-red-500": true, "hidden": false })

clsx converts this to: "p-4 text-white p-2 bg-red-500"

twMerge cleans it:  "p-2 text-white bg-red-500"
(Because twMerge knows p-4 is overridden by p-2)
*/
