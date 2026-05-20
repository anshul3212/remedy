"use client";

import { useRef, useMemo } from "react";
import JoditEditor from "jodit-react";

function TextEditor({ content, setContent }: any) {
  const editor = useRef(null);

  const isEditorEmpty = (html: string) => {
    const cleaned = html
      ?.replace(/<p><br><\/p>/g, "")
      ?.replace(/<br>/g, "")
      ?.replace(/&nbsp;/g, "")
      ?.replace(/<[^>]*>/g, "")
      ?.trim();

    return cleaned === "";
  };

  const config = useMemo(
    () => ({
      readonly: false,

      placeholder: isEditorEmpty(content) ? "Start typing..." : "",

      height: 400,

      enter: "p" as const,

      enterBlock: "p" as const,

      toolbarAdaptive: false,

      showCharsCounter: false,
      showWordsCounter: false,
      showXPathInStatusbar: false,

      buttons: [
        "bold",
        "italic",
        "underline",
        "|",
        {
          name: "bulletList",
          icon: "ul",
          exec: (editor: any) => {
            editor.execCommand("insertUnorderedList");
          },
        },

        {
          name: "numberList",
          icon: "ol",
          exec: (editor: any) => {
            editor.execCommand("insertOrderedList");
          },
        },
        "|",

        {
          name: "paragraph",
          list: {
            p: "Paragraph",
            h1: "Heading 1",
            h2: "Heading 2",
            h3: "Heading 3",
          },
        },
        "|",
        "align",
      ],
    }),
    [content],
  );
  return (
    <div className="flex flex-col gap-2 max-w-full">
      <span className="font-medium font-inter text-sm text-[#000000]">
        Description
      </span>

      <JoditEditor
        ref={editor}
        config={config}
        tabIndex={1}
        onBlur={(newContent) => {
          if (isEditorEmpty(newContent)) {
            setContent("");
          } else {
            setContent(newContent);
          }
        }}
        className="jodit-content max-w-full"
        value={content}
      />
    </div>
  );
}

export default TextEditor;
