const { getUserRole } = require("../auth/roleGuard");

const verifyRole = (...allowedRoles) => {
  return async (req, res, next) => {
    try {
      const role = await getUserRole(req.user.uid);

      if (!allowedRoles.includes(role)) {
        return res.status(403).json({
          message: `Access denied. Required role: ${allowedRoles.join(" or ")}`
        });
      }

      req.userRole = role; // 3shan 2hot el role fe al request
      next();
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
};

module.exports = verifyRole;