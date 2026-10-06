/**
 * NoSQL Query Injection Sanitizer
 * Recursively strips keys starting with '$' or containing '.' to protect MongoDB queries.
 */

function sanitizeValue(value) {
  if (value === null || value === undefined) return value;
  
  if (Array.isArray(value)) {
    return value.map(sanitizeValue);
  }
  
  if (typeof value === 'object' && !(value instanceof Date) && !(value instanceof RegExp)) {
    const cleanObj = {};
    for (const key of Object.keys(value)) {
      // Remove keys starting with $ or containing . to block operator injection ($gt, $where, $regex, etc.)
      if (key.startsWith('$') || key.includes('.')) {
        continue;
      }
      cleanObj[key] = sanitizeValue(value[key]);
    }
    return cleanObj;
  }
  
  return value;
}

export const sanitizeNoSql = (req, res, next) => {
  if (req.body) {
    req.body = sanitizeValue(req.body);
  }
  if (req.query) {
    req.query = sanitizeValue(req.query);
  }
  if (req.params) {
    req.params = sanitizeValue(req.params);
  }
  next();
};
