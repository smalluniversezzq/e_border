import store from '@/store'
export function actionToObject (json) {
  try {
    return JSON.parse(json)
  } catch (e) {
    console.log('err', e.message)
  }
  return []
}
// 用来控制按钮的显示
export function hasBtnPermission(permission) {
  const myBtns = store.getters.buttons
  return myBtns.indexOf(permission) > -1
}
