const callbackLog = (req, res, next) => {
  console.log('Callback Log Middleware Reached:', req.method, req.originalUrl, req.body);
  next();
}

export { callbackLog };