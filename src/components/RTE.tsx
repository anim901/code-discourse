"use client";

import dynamic from "next/dynamic";

import Editor from "@uiw/react-md-editor";

// for more information, see https://mdxeditor.dev/editor/docs/getting-started

// This is the only place InitializedMDXEditor is imported directly.

// this is lazy-loading concept ....code is given in lazy loading of next js
const RTE = dynamic(
  () =>
    import("@uiw/react-md-editor").then((mod) => {
      return mod.default;
    }),
  { ssr: false }
);

export const MarkdownPreview = Editor.Markdown;

export default RTE;
/* 
Dynamic import always returns a Promise of an object that holds all exports.
example below: 

// file: math.js
export default function add(a, b) {
  return a + b;
}
export const PI = 3.14;

When you dynamically import it:
import('math.js').then((mod) => console.log(mod));
You will get:

{
  default: [Function: add],
  PI: 3.14
}
*/
