import React, { useEffect, useMemo, useRef, useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import * as S from "./TextEditor.style";
import "./Editor.css";

const TextEditor = ({ fontFamily = "Noto Sans" }) => {
  const [text, setText] = useState("");
  const quillRef = useRef(null);

  const formats = [
    "font",
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "list",
    "bullet",
    "indent",
    "link",
    "align",
    "color",
    "background",
    "size",
    "h1",
  ];

  const modules = useMemo(() => {
    return {
      toolbar: {
        background: "black",
        container: [
          ["bold", "italic", "underline"],
          [{ align: [] }],
          [{ list: "bullet" }, { list: "ordered" }],
          [
            {
              color: [],
            },
            { background: [] },
          ],
        ],
      },
    };
  }, []);

  function onChangeContents(contents) {
    setText(contents);
  }

  //페이지 컴포넌트에서 prop로 내려받은 폰트 선택 state(fontFamily)가 변경될 때 handleFontChange함수 호출
  function handleFontChange(ref) {
    ref.current.style.fontFamily = fontFamily;
  }

  useEffect(() => {
    handleFontChange(quillRef);
  }, [fontFamily]);

  return (
    <S.TextEditorContainer>
      <ReactQuill
        onChange={onChangeContents}
        modules={modules}
        formats={formats}
        placeholder="I am your reach text editor."
      />
    </S.TextEditorContainer>
  );
};

export default TextEditor;
