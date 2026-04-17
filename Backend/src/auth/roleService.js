
const admin = require("firebase-admin");

async function assignRole(uid, role = "student") {
  try {
   
    
    await admin.auth().setCustomUserClaims(uid, { role });

    const userRef = admin.firestore().collection("users").doc(uid);
    await userRef.update({ role });
    
    return { success: true, message: `Role '${role}' assigned to user ${uid}` };
  } catch (err) {
    throw new Error("Failed to assign role: " + err.message);
  }
}


async function getUserRole(uid) {
  try {
    const user = await admin.auth().getUser(uid);
    return user.customClaims?.role || "student";
  } catch (err) {
    throw new Error("Failed to get user role: " + err.message);
  }
}


async function hasRole(uid, role) {
  const userRole = await getUserRole(uid);
  return userRole === role;
}


function authorizeRoles(...allowedRoles) {
  return async (req, res, next) => {
    try {
      const idToken = req.headers.authorization?.split("Bearer ")[1];
      if (!idToken) return res.status(401).json({ message: "No token provided" });

      const decodedToken = await admin.auth().verifyIdToken(idToken);
      const userRole = decodedToken.role || "student";

      if (!allowedRoles.includes(userRole))
        return res.status(403).json({ message: "Forbidden: insufficient role" });

      req.user = { uid: decodedToken.uid, role: userRole };
      next();
    } catch (err) {
      return res.status(401).json({ message: "Unauthorized: " + err.message });
    }
  };
}

module.exports = {
  assignRole,
  getUserRole,
  hasRole,
  authorizeRoles,
};