const isVercel = Boolean(process.env.VERCEL);

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  cyan: '\x1b[36m',
  gray: '\x1b[90m'
};

function logMessage(level, ...args) {
  const timestamp = new Date().toLocaleTimeString('zh-CN', { hour12: false });
  
  if (isVercel) {
    // Vercel 环境使用对应的 console 方法确保日志被捕获
    const logFn = { info: console.info, warn: console.warn, error: console.error }[level] || console.log;
    logFn(`[${timestamp}] [${level}]`, ...args);
  } else {
    const color = { info: colors.green, warn: colors.yellow, error: colors.red }[level];
    console.log(`${colors.gray}${timestamp}${colors.reset} ${color}[${level}]${colors.reset}`, ...args);
  }
}

function logRequest(method, path, status, duration) {
  if (isVercel) {
    console.info(`[${method}] - ${path} ${status} ${duration}ms`);
  } else {
    const statusColor = status >= 500 ? colors.red : status >= 400 ? colors.yellow : colors.green;
    console.log(`${colors.cyan}[${method}]${colors.reset} - ${path} ${statusColor}${status}${colors.reset} ${colors.gray}${duration}ms${colors.reset}`);
  }
}

export const log = {
  info: (...args) => logMessage('info', ...args),
  warn: (...args) => logMessage('warn', ...args),
  error: (...args) => logMessage('error', ...args),
  request: logRequest
};

export default log;
