export const formatNumber = (value) => {
  if (typeof value === 'string') {
    return value.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  }
  return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

export const unformatNumber = (value) => {
  return value.replace(/,/g, '')
}
