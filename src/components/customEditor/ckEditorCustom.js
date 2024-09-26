import React, { memo, useEffect, useRef } from 'react'
import { CKEditor } from 'ckeditor4-react'

function CKedtiorCustom({ data, onChangeData }) {
  const editorInstance = useRef(null)

  useEffect(() => {
    if (editorInstance.current && editorInstance.current.getData() !== data) {
      editorInstance.current.setData(data)
    }
  }, [data])
  return (
    <CKEditor
      config={{
        versionCheck: false,
        extraPlugins: 'justify',
        filebrowserBrowseUrl: 'http://api.chinhnhan.com/ckfinder/ckfinder.html',
        filebrowserImageBrowseUrl: 'http://api.chinhnhan.com/ckfinder/ckfinder.html?type=Images',
        filebrowserUploadUrl:
          'http://api.chinhnhan.com/ckfinder/core/connector/php/connector.php?command=QuickUpload&type=Files',
        filebrowserImageUploadUrl:
          'http://api.chinhnhan.com/ckfinder/core/connector/php/connector.php?command=QuickUpload&type=Images',
      }}
      initData={data}
      onChange={(event) => {
        const newData = event.editor.getData()
        if (newData !== data) {
          onChangeData(newData)
        }
      }}
      onInstanceReady={(event) => {
        editorInstance.current = event.editor
        event.editor.setData(data)
      }}
    />
  )
}

export default CKedtiorCustom
