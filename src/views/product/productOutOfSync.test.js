import React from 'react'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import ProductOutOfSync from './productOutOfSync'
import { axiosClient } from '../../axiosConfig'

jest.mock('../../axiosConfig', () => ({ axiosClient: { get: jest.fn(), post: jest.fn() } }))
jest.mock('react-toastify', () => ({ toast: { success: jest.fn(), error: jest.fn() } }))

test('list shows the non-sync schedule and keeps unscheduled products blank', async () => {
  axiosClient.get.mockResolvedValue({
    data: {
      status: true,
      data: [
        {
          id: 1,
          TenHH: 'Sản phẩm có lịch không đồng bộ',
          MaHH: 'TEST_SCHEDULE',
          type: 'skip',
          price: 1000000,
          display: 1,
          start_date: '2026-10-16 08:30:00',
          end_date: '2026-11-01 17:45:00',
        },
        {
          id: 2,
          TenHH: 'Sản phẩm chưa đặt lịch',
          MaHH: 'TEST_NO_SCHEDULE',
          type: 'skip',
          price: 1000000,
          display: 1,
          start_date: null,
          end_date: null,
        },
      ],
      pagination: { total: 2, current_page: 1, last_page: 1 },
    },
  })
  const { container } = render(
    <MemoryRouter>
      <ProductOutOfSync />
    </MemoryRouter>,
  )
  await screen.findByText('16/10/2026 08:30')
  expect(screen.getByText('01/11/2026 17:45')).toBeInTheDocument()
  expect(screen.getByRole('columnheader', { name: 'Ngày bắt đầu' })).toBeInTheDocument()
  expect(screen.getByRole('columnheader', { name: 'Ngày kết thúc' })).toBeInTheDocument()
  expect(screen.getAllByText('—')).toHaveLength(2)
  expect(screen.getAllByTitle('Sửa')).toHaveLength(2)
  expect(screen.getAllByTitle('Xóa')).toHaveLength(2)
  expect(container.querySelector('.out-of-sync-page')).toHaveClass('container-fluid')
  if (process.env.SKIP_SCHEDULE_PREVIEW) {
    const fs = require('fs')
    fs.writeFileSync(
      process.env.SKIP_SCHEDULE_PREVIEW,
      '<!doctype html><html lang="vi"><head><meta charset="utf-8"><link rel="stylesheet" href="layout.css"><style>body{background:#f5f6f8;padding-block:28px;font-family:Arial,sans-serif}</style></head><body><div class="container-lg px-4">' +
        container.innerHTML +
        '</div></body></html>',
    )
  }
})
