import app from '../src/server/index.js';

// Vercel Serverless Function 入口
// 直接导出 Express app，Vercel 会自动处理
export default app;

// 同时导出 config 以支持更长的执行时间
export const config = {
  maxDuration: 60
};
