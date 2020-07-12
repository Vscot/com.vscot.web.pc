# Vscot PC template

基于 Ant Design Pro 构建

TODO:

- 内置权限系统重写
- 部分页面重写
- 基础页面支持

代码编写建议：

- 基于 React 开发
- 基于 React Hooks 开发（不推荐 Class Component 写法）
  ```TypeScript
  import React, { useState } from 'react';
  const TestComponent = () => {
    const [count,setCount] = useState(0);
    return (
        <div>
        {count}
        </div>
    )
  }
  ```
- 基于 TypeScript 开发，减少因为 JavaScript 导致的一些常见错误
