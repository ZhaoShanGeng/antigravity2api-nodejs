import app from '../src/server/index.js';

const API_PREFIX = '/api/index';

/**
 * Vercel rewrite 会把路径改成 /api/index/...，这里还原成原始路径，保证 Express 路由匹配
 */
function normalizeUrl(req) {
  const url = req.url || '/';
  if (url === API_PREFIX || url === `${API_PREFIX}/`) {
    return '/';
  }
  if (url.startsWith(`${API_PREFIX}/`)) {
    return url.slice(API_PREFIX.length) || '/';
  }
  return url;
}

// Vercel Serverless Function 入口
export default function handler(req, res) {
  req.url = normalizeUrl(req);
  return app(req, res);
}

// 同时导出 config 以支持更长的执行时间
export const config = {
  maxDuration: 60
};
