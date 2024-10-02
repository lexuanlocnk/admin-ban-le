import React from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import 'core-js'

import { pdfjs } from 'react-pdf'

import App from './App'
import store from './store'

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url,
).toString()

createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <App />,
  </Provider>,
)
