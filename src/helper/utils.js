export const formatNumber = (value) => {
  return value.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

export const unformatNumber = (value) => {
  return value.replace(/,/g, '')
}
