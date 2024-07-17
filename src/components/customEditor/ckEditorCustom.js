import React, { useEffect, useRef } from 'react'
import { CKEditor } from 'ckeditor4-react'

function CKedtiorCustom({ data, onChangeData }) {
  // const editorRef = useRef(null)

  // useEffect(() => {
  //   if (editorRef.current) {
  //     editorRef.current.setData(data)
  //   }
  // }, [data])
  return (
    <CKEditor
      config={{
        versionCheck: false,
        extraPlugins: 'justify',
      }}
      initData={data}
      onChange={(event) => {
        const data = event.editor.getData()
        onChangeData(data)
      }}
      // onInstanceReady={(event) => {
      //   editorRef.current = event.editor
      //   event.editor.setData(data)
      // }}
    />
  )
}

export default CKedtiorCustom
