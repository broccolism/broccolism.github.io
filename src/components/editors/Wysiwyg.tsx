import { EditorState } from "draft-js";
import { useState } from "react";
import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import styled from "styled-components";

function Wysiwyg() {
  const [editorState, setEditorState] = useState(EditorState.createEmpty());

  const saveNewState = (editorState: EditorState) => {
    setEditorState(editorState);
  };

  return (
    <Style>
      <Editor
        // 에디터와 툴바 모두에 적용
        wrapperClassName="wrapper-class"
        // 에디터 주변에 적용
        editorClassName="editor"
        // 툴바 주위에 적용
        toolbarClassName="toolbar-class"
        // 툴바 설정
        toolbar={{
          // inDropdown: 해당 항목과 관련된 항목을 드롭다운으로 나타낼것인지
          list: { inDropdown: true },
          textAlign: { inDropdown: true },
          link: { inDropdown: true },
          history: { inDropdown: false },
        }}
        placeholder="내용을 작성해주세요."
        // 한국어 설정
        localization={{
          locale: "ko",
        }}
        // 초기값 설정
        editorState={editorState}
        // 에디터의 값이 변경될 때마다 onEditorStateChange 호출
        onEditorStateChange={saveNewState}
      />
    </Style>
  );
}

export default Wysiwyg;

const Style = styled.div`
  .wrapper-class {
    width: 60vw;
    margin: 0 auto;
    margin-bottom: 4rem;
  }
  .editor {
    height: 60vh !important;
    border: 1px solid #f1f1f1 !important;
    padding: 5px !important;
    border-radius: 2px !important;
  }
`;
