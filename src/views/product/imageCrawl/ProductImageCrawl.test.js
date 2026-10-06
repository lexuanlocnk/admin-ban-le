import React from 'react'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import ProductImageCrawl from './ProductImageCrawl'
import { axiosClient } from '../../../axiosConfig'

jest.mock('../../../axiosConfig', () => ({
  axiosClient: { get: jest.fn(), post: jest.fn() },
  imageBaseUrl: 'https://api.example/uploads/',
}))
jest.mock('react-toastify', () => ({ toast: { success: jest.fn(), error: jest.fn() } }))

const fixture = (status = 'pending') => ({
  data: {
    data: {
      product: { product_id: 42, title: 'DELL TOWER ECT1250', MaHH: 'MBDE_ECT1250' },
      job: { status: 'partial', error: 'Chỉ có 1 ảnh hợp lệ.' },
      images: [
        {
          id: 7,
          product_id: 42,
          status,
          domain: 'dell.com',
          ocr_score: null,
          preview_url: 'https://api.example/uploads/crawl-pending/image.jpg',
          warning: 'Không đọc được OCR. Cần kiểm tra thủ công.',
          width: 500,
          height: 500,
          source_url: 'https://dell.com/product',
          image_url: 'https://dell.com/image.jpg',
          ocr_texts: [],
        },
      ],
    },
  },
})

const mount = () =>
  render(
    <MemoryRouter initialEntries={['/product/image-crawl/42']}>
      <Routes>
        <Route path="/product/image-crawl/:productId" element={<ProductImageCrawl />} />
      </Routes>
    </MemoryRouter>,
  )

beforeEach(() => {
  jest.clearAllMocks()
  axiosClient.get.mockResolvedValue(fixture())
})

test('unknown OCR is shown as requiring review and images are not preselected', async () => {
  mount()
  await screen.findByText('DELL TOWER ECT1250')
  expect(screen.getByText('Chưa đọc OCR')).toBeInTheDocument()
  expect(screen.getByRole('checkbox', { name: 'Chọn ảnh 7' })).not.toBeChecked()
  expect(screen.getByRole('button', { name: /Duyệt và chuyển/ })).toBeDisabled()
})

test('approval sends only the selected product candidate and refreshes its status', async () => {
  axiosClient.post.mockResolvedValue({ data: { message: 'Đã xử lý 1 ảnh.' } })
  mount()
  await screen.findByText('DELL TOWER ECT1250')
  fireEvent.click(screen.getByRole('checkbox', { name: 'Chọn ảnh 7' }))
  axiosClient.get.mockResolvedValue(fixture('approved'))
  fireEvent.click(screen.getByRole('button', { name: /Duyệt và chuyển/ }))
  await waitFor(() =>
    expect(axiosClient.post).toHaveBeenCalledWith('admin/product-image-crawls/42/review', {
      action: 'approve',
      ids: [7],
    }),
  )
  await screen.findByText('Đã duyệt')
  expect(screen.getByRole('checkbox', { name: 'Chọn ảnh 7' })).toBeDisabled()
})

test('manual source request uses separate URLs and does not publish images', async () => {
  axiosClient.post.mockResolvedValue({ data: { message: 'Yêu cầu đang chờ máy Đồng bộ xử lý.' } })
  mount()
  await screen.findByText('DELL TOWER ECT1250')
  fireEvent.change(screen.getByLabelText(/URL trang sản phẩm nguồn/), {
    target: { value: 'https://dell.com/product\nhttps://retailer.example/product' },
  })
  fireEvent.click(screen.getByRole('button', { name: 'Yêu cầu crawl lại' }))
  await waitFor(() =>
    expect(axiosClient.post).toHaveBeenCalledWith('admin/product-image-crawls/42/enqueue', {
      source_urls: ['https://dell.com/product', 'https://retailer.example/product'],
    }),
  )
  expect(axiosClient.post).toHaveBeenCalledTimes(1)
  await waitFor(() =>
    expect(screen.getByRole('button', { name: 'Yêu cầu crawl lại' })).toBeEnabled(),
  )
})
