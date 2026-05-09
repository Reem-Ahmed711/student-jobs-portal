// D:\student-jobs-portal\Backend\src\middleware\verifyRole.js

const verifyRole = (...roles) => {
  return (req, res, next) => {
    console.log("🔵 verifyRole - req.user:", req.user);
    
    if (!req.user) {
      console.log("❌ No user object found");
      return res.status(401).json({ message: "User not authenticated" });
    }
    
    if (!req.user.role) {
      console.log("❌ No role found in user object");
      return res.status(403).json({ message: "Role not found" });
    }

    console.log(`🔵 User role: ${req.user.role}, Allowed roles: ${roles.join(" or ")}`);

    if (!roles.includes(req.user.role)) {
      console.log(`❌ Access denied. Required: ${roles.join(" or ")}`);
      return res.status(403).json({
        message: `Access denied. Required: ${roles.join(" or ")}`,
      });
    }

    console.log("✅ Role verified successfully");
    next();
  };
};

module.exports = verifyRole;