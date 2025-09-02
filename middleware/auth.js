import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  const authHeader = req.headers.auth;
  if (!authHeader || !authHeader.startwith("Bearer ")) {
    return res
      .status(401)
      .json({ message: "Access denied, token not provided" });
  }
  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({
      message: "Invalid token,",
    });
  }
};

export const verifyAdmin = (req, res, next) => {
  if (req.user.role === "admin") {
    next()
  } else {
    return res.status(403).json({
      message: "Access denied, Admins only"
    })
  }
};
