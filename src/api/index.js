// 引入二次封装的axios
import request from './request'

// 登录
export const reqLogin = (username, password) => request.post('login', { username, password })
// 获取左侧菜单栏
export const reqSideMenus = () => request.get('menus')
// 获取用户数据列表
export const reqUserList = (userInfo) => request.get('users', { params: userInfo })
// 修改用户状态
export const reqUserStatusChange = (uId, type) => request.put(`users/${uId}/state/${type}`)
// 添加用户
export const reqAddUser = (userInfo) => request.post('users', userInfo)
// 修改用户信息
export const reqEditUserInfo = (id, userInfo) => request.put(`users/${id}`, userInfo)
// 根据id查询用户信息
export const reqUserInfoById = (id) => request.get(`users/${id}`)
// 根据id删除单个用户数据
export const reqDeleteUserById = (id) => request.delete(`users/${id}`)
// 获取所有权限列表
export const reqRightsList = (type) => request.get(`rights/${type}`)
// 获取角色列表 
export const reqRolesList = () => request.get('roles')
// 根据id移除对应权限
export const reqRemoveRightById = (roleId, rightId) => request.delete(`roles/${roleId}/rights/${rightId}`)
// 分配角色权限
export const reqAllotRights = (roleId, rids) => request.post(`roles/${roleId}/rights`, { rids })
// 分配用户角色
export const reqAllotUserRole = (id, rid) => request.put(`users/${id}/role`, { rid })