/**
 * Vercel Edge Config 存储适配器
 * 在 Vercel 环境下使用 Edge Config 替代本地文件系统
 */

const isVercel = Boolean(process.env.VERCEL);
const EDGE_CONFIG = process.env.EDGE_CONFIG;

/**
 * 解析 Edge Config 连接字符串
 * 格式: https://edge-config.vercel.com/ecfg_xxx?token=xxx
 */
function parseEdgeConfigUrl() {
  if (!EDGE_CONFIG) return null;
  
  try {
    const url = new URL(EDGE_CONFIG);
    const configId = url.pathname.replace('/', '');
    const token = url.searchParams.get('token');
    return { configId, token, baseUrl: `${url.protocol}//${url.host}` };
  } catch (e) {
    console.error('Edge Config URL 解析失败:', e.message);
    return null;
  }
}

/**
 * 从 Edge Config 读取数据
 * @param {string} key - 配置键名
 * @returns {Promise<any>}
 */
export async function getEdgeConfig(key) {
  const config = parseEdgeConfigUrl();
  if (!config) {
    return null;
  }
  
  try {
    // Edge Config REST API: GET /v1/config/:configId/item/:key
    const url = `${config.baseUrl}/${config.configId}/item/${key}?token=${config.token}`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      if (response.status === 404) {
        console.info(`Edge Config key "${key}" 不存在`);
        return null;
      }
      const text = await response.text();
      throw new Error(`Edge Config 读取失败: ${response.status} - ${text}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`Edge Config 读取错误 [${key}]:`, error.message);
    return null;
  }
}

/**
 * 检查是否在 Vercel 环境
 */
export function isVercelEnvironment() {
  return isVercel;
}

/**
 * 获取环境变量配置（Vercel 环境下从环境变量读取）
 */
export function getVercelEnvConfig() {
  if (!isVercel) return null;
  
  return {
    API_KEY: process.env.API_KEY || null,
    ADMIN_USERNAME: process.env.ADMIN_USERNAME || null,
    ADMIN_PASSWORD: process.env.ADMIN_PASSWORD || null,
    JWT_SECRET: process.env.JWT_SECRET || null,
    PROXY: process.env.PROXY || null,
    SYSTEM_INSTRUCTION: process.env.SYSTEM_INSTRUCTION || '',
    IMAGE_BASE_URL: process.env.IMAGE_BASE_URL || null
  };
}

export default {
  getEdgeConfig,
  isVercelEnvironment,
  getVercelEnvConfig
};