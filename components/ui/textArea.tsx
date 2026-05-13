"use client";

import { useRef, useMemo } from "react";
import JoditEditor from "jodit-react";

function TextEditor( {content, setContent}:any) {
  const editor = useRef(null);

const config = useMemo(
  () => ({
    readonly: false,

    placeholder:
      content && content.trim() !== ""
        ? ""
        : "Start typing...",

    height: 400,

    enter: "P",
    enterBlock: "p",

    toolbarAdaptive: false,

    buttons: [
      "bold",
      "italic",
      "underline",
      "|",
      "ul",
      "ol",
      "|",
      "paragraph",
      "|",
      "align",
      "undo",
      "redo",
    ],
  }),
  [content]
);
  return (
    <div className="flex flex-col gap-2 max-w-full">
      <span className="font-medium font-inter text-sm text-[#000000]">Description</span>
      <JoditEditor
        ref={editor}
        config={config}
        tabIndex={1}
        onBlur={(newContent) => {setContent(newContent);}}
        className="jodit-content max-w-full"
        value={content}
      />
    </div>
  );
}

export default TextEditor;
