# Vscot PC template

基于 Ant Design Pro 构建

#### 目前已经完成的部分

- eslint 等代码规范工具集成
- 整体仓库已经建立

TODO:

- 原有代码规范
- 内置权限系统重写
- 部分页面重写
- 基础页面支持
- 统一 Request 封装
- 统一错误处理

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
- 推荐使用 Umi Hooks（配合 React Hooks 方便开发）
- 图表使用 AntV 或者 Bizcharts（不使用 Echarts，文档体验不好）
