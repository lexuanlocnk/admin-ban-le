import { legacy_createStore as createStore } from 'redux'

const getInitialSidebarWidth = () => {
  try {
    const saved = localStorage.getItem('admin_sidebar_width')
    if (saved) {
      const parsed = parseInt(saved, 10)
      if (!isNaN(parsed) && parsed >= 220 && parsed <= 600) {
        return parsed
      }
    }
  } catch (e) {}
  return 290
}

const initialState = {
  sidebarShow: true,
  sidebarWidth: getInitialSidebarWidth(),
  theme: 'light',
}

const changeState = (state = initialState, { type, ...rest }) => {
  switch (type) {
    case 'set':
      return { ...state, ...rest }
    default:
      return state
  }
}

const store = createStore(changeState)
export default store
