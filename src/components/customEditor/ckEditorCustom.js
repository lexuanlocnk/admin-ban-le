import React from 'react'
import { CKEditor } from 'ckeditor4-react'

function CKedtiorCustom({ data, onChangeData }) {
  return (
    <CKEditor
      config={{
        versionCheck: false,
        extraPlugins: 'justify',
      }}
      value={data}
      onChange={(event) => {
        const data = event.editor.getData()
        onChangeData(data)
      }}
    />
  )
}

export default CKedtiorCustom
