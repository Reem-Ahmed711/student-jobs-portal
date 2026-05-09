const requireRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user?.role) {
      return res.status(403).json({ message: "Role not found" });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        message: `Access denied. Required: ${roles.join(" or ")}`,
      });
    }

    next();
  };
};

module.exports = requireRole;
