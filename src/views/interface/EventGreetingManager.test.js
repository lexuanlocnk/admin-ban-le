import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import EventGreetingManager from './EventGreetingManager'
import { axiosClient } from '../../axiosConfig'

jest.mock('../../axiosConfig', () => ({ axiosClient: { get: jest.fn(), post: jest.fn() } }))
jest.mock('axios', () => ({ create: () => require('../../axiosConfig').axiosClient }))
jest.mock('react-toastify', () => ({
  toast: { success: jest.fn(), error: jest.fn(), info: jest.fn() },
}))

test('simplified editor preserves removed text fields and keeps save after both columns', async () => {
  const fs = require('fs')
  const event = process.env.GREETING_EDITOR_FIXTURE
    ? JSON.parse(fs.readFileSync(process.env.GREETING_EDITOR_FIXTURE, 'utf8'))
    : {
        id: 1,
        title: 'Preview event',
        code: 'preview',
        is_active: false,
        base_visitor_count: 500,
        display_frequency: 'once_per_day',
        popup_config: {
          step1: { button_text: 'Existing button text', layout: { counter: { x: 70, y: 59 } } },
          step2: { subtitle: 'Existing subtitle' },
          step3: { title: 'Existing result title' },
        },
      }
  axiosClient.get.mockImplementation((url) =>
    Promise.resolve({
      data: {
        status: true,
        data: url.endsWith('/events')
          ? [event]
          : url.endsWith('/wishes')
            ? []
            : { today: { visitor_count: 0, gift_opened_count: 0 } },
      },
    }),
  )
  axiosClient.post.mockResolvedValue({ data: { status: true } })
  const { container } = render(<EventGreetingManager />)
  await screen.findAllByDisplayValue(event.title)
  const save = screen.getByRole('button', { name: 'Lưu Cấu Hình Sự Kiện' })
  await waitFor(() => expect(save).toBeEnabled())
  expect(save.closest('.event-save-bar').parentElement.tagName).toBe('FORM')
  expect(screen.getByText('Số Thứ Tự Khách Khởi Điểm (Mỗi ngày)').closest('.row')).toHaveClass(
    'align-items-end',
  )
  for (const text of [
    /Cấu Hình Logo Popup Sự Kiện/,
    /Nút hành động mở quà/,
    /Dùng ngay banner/,
    /Tiêu đề phụ:/,
    /Tiêu đề popup kết quả:/,
    /Ảnh thiệp & lời chúc/,
  ]) {
    expect(screen.queryByText(text)).not.toBeInTheDocument()
  }
  expect(container.querySelectorAll('#popup-step-panel-1 input[type=file]')).toHaveLength(1)
  expect(container.querySelectorAll('#popup-step-panel-2 input[type=file]')).toHaveLength(1)
  expect(container.querySelectorAll('#popup-step-panel-3 input[type=file]')).toHaveLength(1)
  if (process.env.GREETING_EDITOR_PREVIEW) {
    container
      .querySelectorAll('option')
      .forEach((option) => option.toggleAttribute('selected', option.selected))
    fs.writeFileSync(
      process.env.GREETING_EDITOR_PREVIEW,
      '<!doctype html><html lang="vi"><head><meta charset="utf-8"><link rel="stylesheet" href="admin.css"><style>body{background:#f5f6f8;padding:24px;font-family:Arial,sans-serif}</style></head><body>' +
        container.innerHTML +
        '</body></html>',
    )
  }
  fireEvent.submit(save.closest('form'))
  await waitFor(() => expect(axiosClient.post).toHaveBeenCalled())
  const [endpoint, saved] = axiosClient.post.mock.calls.at(-1)
  expect(endpoint).toBe('event-greeting/admin/save-event')
  expect(saved.is_active).toBe(Boolean(event.is_active))
  expect(saved.popup_config.step1.button_text).toBe(event.popup_config.step1.button_text)
  expect(saved.popup_config.step2.subtitle).toBe(event.popup_config.step2.subtitle)
  expect(saved.popup_config.step3.title).toBe(event.popup_config.step3.title)
  expect(saved.popup_config.step1.layout.counter.x).toBe(70)
  expect(saved.popup_config.step1.layout.counter.y).toBe(59)
})
