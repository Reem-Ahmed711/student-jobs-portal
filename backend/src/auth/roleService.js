const admin = require('../config/firebase');

async function assignRole(uid, role) {
  if (!['student', 'admin', 'employer'].includes(role)) {
    throw new Error('Invalid role');
  }
  await admin.auth().setCustomUserClaims(uid, { role });
  return true;
}

async function getRole(uid) {
  const user = await admin.auth().getUser(uid);
  return user.customClaims?.role || 'student';
}

module.exports = { assignRole, getRole };