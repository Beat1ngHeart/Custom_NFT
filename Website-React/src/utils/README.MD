# IPFS 工具函数说明文档

本文档解释了 `ipfs.ts` 中使用的关键概念和 API。

---

## 📚 目录

- [async function](#async-function)
- [FormData](#formdata)
- [HTTP 请求方法 (method)](#http-请求方法-method)
- [HTTP 请求头 (headers)](#http-请求头-headers)
- [认证方案 (Authorization)](#认证方案-authorization)

---

## async function

**异步函数**，用于处理需要等待的操作（如网络请求、文件读取）。让函数可以执行异步操作，不会阻塞其他代码。

### ❌ 错误示例

```typescript
// 这样写会阻塞整个程序
function uploadFile() {
  const response = fetch('https://api.example.com/upload')  // 需要几秒钟
  return response  // 但 response 还没准备好！
}
```

### ✅ 正确示例

```typescript
// 使用 async/await
async function uploadFile() {
  const response = await fetch('https://api.example.com/upload')  // 等待完成
  const data = await response.json()  // 再等待解析
  return data  // 现在数据准备好了
}
```

### 使用 await 等待异步操作

```typescript
async function example() {
  // await 会等待 fetch 完成
  const response = await fetch('https://api.example.com')
  
  // await 会等待 JSON 解析完成
  const data = await response.json()
  
  // 现在可以使用 data 了
  console.log(data)
}
```

---

## FormData

`FormData` 是一个 Web API，用于创建类似 HTML 表单的数据格式，特别适合上传文件。

### 基本用法

```typescript
const formData = new FormData()
formData.append('file', file)
```

- `'file'`：字段名（服务器期望的字段名）
- `file`：要上传的文件对象

### ❌ 错误示例

```typescript
// 不能直接发送文件对象
fetch('https://api.example.com/upload', {
  method: 'POST',
  body: file  // 这样不行！
})
```

### ✅ 正确示例

```typescript
// 使用 FormData
const formData = new FormData()
formData.append('file', file)

fetch('https://api.example.com/upload', {
  method: 'POST',
  body: formData  // 现在可以了！
})
```

---

## HTTP 请求方法 (method)

`method` 指定要执行的 HTTP 操作类型。

### 常见的 HTTP 方法

| 方法 | 说明 | 用途 |
|------|------|------|
| `GET` | 获取数据 | 从服务器读取信息（默认方法） |
| `POST` | 提交数据 | 向服务器发送数据（如上传文件） |
| `PUT` | 更新数据 | 更新服务器上的资源 |
| `DELETE` | 删除数据 | 删除服务器上的资源 |
| `PATCH` | 部分更新 | 部分更新资源 |

### 使用示例

```typescript
// GET - 获取数据
fetch('https://api.example.com/users')

// POST - 发送数据
fetch('https://api.example.com/upload', {
  method: 'POST',
  body: formData
})
```

---

## HTTP 请求头 (headers)

`headers` 包含请求的元数据，告诉服务器如何处理请求。

### 常见的请求头

| 请求头 | 说明 | 例子 |
|--------|------|------|
| `Authorization` | 身份认证 | `Bearer token123` |
| `Content-Type` | 数据类型 | `application/json` |
| `Accept` | 期望的响应类型 | `application/json` |
| `User-Agent` | 客户端信息 | 浏览器自动添加 |

### 使用示例

```typescript
fetch('https://api.example.com/data', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer token123',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({ name: '张三' })
})
```

---

## 认证方案 (Authorization)

不同的 API 使用不同的认证方案格式。

### 认证方案对比

| 认证方案 | 格式 | 用途 |
|---------|------|------|
| `Bearer` | `Bearer <token>` | JWT、OAuth 2.0 token |
| `Basic` | `Basic <base64>` | 用户名密码 |
| `Digest` | `Digest ...` | 摘要认证 |
| `Custom` | 自定义格式 | 某些 API 的特殊格式 |

### Bearer Token 使用示例

```typescript
// ✅ 正确：使用 Bearer 前缀
headers: {
  'Authorization': `Bearer ${jwtToken}`
}
// 发送: Authorization: Bearer eyJhbGciOiJIUzI1NiIs...

// ❌ 错误：缺少 Bearer 前缀
headers: {
  'Authorization': jwtToken  // 服务器不知道这是什么格式
}
```

### 为什么需要 `Bearer` 前缀？

- `Bearer` 告诉服务器这是 Bearer token 格式
- 空格是标准格式要求的分隔符
- `${apiToken}` 是实际的认证凭证
- 这是 OAuth 2.0 和 JWT 的行业标准格式

---

## 📝 相关文件

- `ipfs.ts` - IPFS 上传工具函数实现
- `ImageUploader.tsx` - 使用这些函数的组件示例

---

## 🔗 参考资源

- [MDN - async function](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Statements/async_function)
- [MDN - FormData](https://developer.mozilla.org/zh-CN/docs/Web/API/FormData)
- [MDN - fetch API](https://developer.mozilla.org/zh-CN/docs/Web/API/Fetch_API)
- [OAuth 2.0 Bearer Token](https://oauth.net/2/bearer-tokens/)
