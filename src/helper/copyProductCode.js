import { toast } from 'react-toastify'

export default async function copyProductCode(code) {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(String(code))
    } else {
      const input = document.createElement('textarea')
      const previousFocus = document.activeElement
      input.value = String(code)
      input.style.position = 'fixed'
      input.style.opacity = '0'
      document.body.appendChild(input)
      try {
        input.select()
        if (!document.execCommand('copy')) throw new Error('Copy failed')
      } finally {
        input.remove()
        previousFocus?.focus()
      }
    }
    toast.success('Đã copy mã sản phẩm.')
  } catch {
    toast.error('Không copy được mã sản phẩm. Hãy thử lại.')
  }
}
