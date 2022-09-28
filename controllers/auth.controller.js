exports.isAuthenticated = async (req, res, next) => {
  if (req.headers.auth !== process.env.PASSWORD) {
    return res.status(401).json({
      status: "Failure",
      code: 401,
      error: "Unauthorized access to API",
    });
  }
  next();
};
