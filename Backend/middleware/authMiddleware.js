import jwt from 'jsonwebtoken';

export const isAuthenticated = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: "Unauthorized. No token provided." });
  }

  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    req.user = {
      _id: decoded.userId,
      email: decoded.usermail,
      role: decoded.userrole
    };
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token." });
  }
};
