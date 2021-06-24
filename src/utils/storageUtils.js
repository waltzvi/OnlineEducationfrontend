// 进行local数据管理存储的工具模块
import store from 'store'
const User_key = 'User_key'
const storageUtils = {
    // 保存user
    saveUser(User) {
        // localStorage.setItem(User_key, JSON.stringify(User))
        store.set(User_key, User)
    },

    // 读取User
    getUser() {
        // return JSON.parse(localStorage.getItem(User_key) || '{}')
        return store.get(User_key) || {}
    },

    //删除User
    removeUser() {
        // localStorage.removeItem(User_key)
        store.remove(User_key)
    }
}
export default storageUtils