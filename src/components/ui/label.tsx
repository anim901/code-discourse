"use client";

import * as React from "react";
import * as LabelPrimitive from "@radix-ui/react-label";
// 	Gives headless, unstyled building blocks (like Label, Dialog, Popover, Tabs, Accordion, etc.)

import { cn } from "@/lib/utils";

function Label({
  className,
  ...props
}: React.ComponentProps<typeof LabelPrimitive.Root>) {
  return (
    <LabelPrimitive.Root
      data-slot="label"
      className={cn(
        "flex items-center gap-2 text-sm leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50",
        className
      )}
      {...props} // curly braces is just for jsx expression and is not included in spread
    />
  );
}

// group-* → Reacts to the parent’s state.
// peer-* → Reacts to the sibling’s state.

export { Label };

/* Step 1: When You Call a Component
Example:

<Label htmlFor="tag" className="text-red-500">
  Tags
</Label>
👉 React automatically builds a props object:

const props = {
  htmlFor: "tag",
  className: "text-red-500",
  children: "Tags"
}

className is pulled out separately.
...props collects all the remaining properties (here: htmlFor and children)

What is @radix-ui/react-label?
It is a Radix UI primitive (a headless component) that gives you:
An accessible HTML label out of the box
Support for features like:
Proper connection to form inputs using htmlFor
Keyboard accessibility
Correct handling of disabled states
It basically wraps the native <label> element and ensures all accessibility best practices are automatically handled.

the three dots mean different at differnet positions -> packs like this: 
className → "text-red-500"
props → { htmlFor: "tag", id: "myLabel", children: "Tags" }
and unpacks like this into individual props 

why .root -> because it is only the main component 
example: 
<Tabs.Root>
  <Tabs.List>
    <Tabs.Trigger value="tab1">Tab 1</Tabs.Trigger>
    <Tabs.Trigger value="tab2">Tab 2</Tabs.Trigger>
  </Tabs.List>

  <Tabs.Content value="tab1">Content for Tab 1</Tabs.Content>
  <Tabs.Content value="tab2">Content for Tab 2</Tabs.Content>
</Tabs.Root>

why typeof ...: 
if not used like that you would have to create-> 
interface LabelProps {
  htmlFor?: string;
  id?: string;
  children?: React.ReactNode;
  // and so on...
}
You can automatically extract all of them:
React.ComponentProps<typeof LabelPrimitive.Root>
✔️ It instantly gives you the entire prop type list.

under the hood this type React.ComponentProps<typeof LabelPrimitive.Root> may look like: 
{
  className?: string;
  htmlFor?: string;
  id?: string;
  children?: React.ReactNode;
  onClick?: () => void;
  // and many more...
}
*/
