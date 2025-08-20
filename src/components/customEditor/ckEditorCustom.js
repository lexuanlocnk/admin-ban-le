import React, { useEffect, useRef } from 'react'
import { CKEditor } from 'ckeditor4-react'

function CKedtiorCustom({ data, onChangeData, config = {} }) {
  const editorInstance = useRef(null)

  useEffect(() => {
    if (editorInstance.current && typeof data === 'string') {
      const cur = editorInstance.current.getData()
      if (cur !== (data || '')) editorInstance.current.setData(data || '')
    }
  }, [data])

  useEffect(() => {
    return () => {
      if (editorInstance.current) {
        try {
          editorInstance.current.destroy()
        } catch {}
        editorInstance.current = null
      }
    }
  }, [])

  const baseConfig = {
    versionCheck: false,
    extraPlugins: ['justify', 'colorbutton', 'font'],
    filebrowserBrowseUrl: 'https://admin.chinhnhan.com/ckfinder/ckfinder.html',
    filebrowserImageBrowseUrl: 'https://admin.chinhnhan.com/ckfinder/ckfinder.html?type=Images',
    filebrowserUploadUrl:
      'https://admin.chinhnhan.com/ckfinder/core/connector/php/connector.php?command=QuickUpload&type=Files',
    filebrowserImageUploadUrl:
      'https://admin.chinhnhan.com/ckfinder/core/connector/php/connector.php?command=QuickUpload&type=Images',
  }

  return (
    <CKEditor
      config={{ ...baseConfig, ...config }}
      data={typeof data === 'string' ? data : ''}
      onInstanceReady={(event) => {
        editorInstance.current = event.editor
        if (typeof data === 'string') {
          event.editor.setData(data || '')
        }
      }}
      onChange={(event) => {
        const newData = event.editor.getData()
        if (newData !== data) onChangeData(newData)
      }}
    />
  )
}

export default CKedtiorCustom
