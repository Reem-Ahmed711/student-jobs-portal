const admin = require('./config/firebase');

async function deleteAllTestUsers() {
  
  const listUsers = await admin.auth().listUsers(1000);
  const testUsers = listUsers.users.filter(u => u.email?.endsWith('@example.com'));
  for (const user of testUsers) {
    await admin.auth().deleteUser(user.uid);
    console.log(`Deleted auth user: ${user.email}`);
  }

  // Delete from Firestore
  const usersRef = admin.firestore().collection('users');
  const snapshot = await usersRef.where('email', '>=', 'dina.test@example.com').get();
  snapshot.forEach(doc => {
    doc.ref.delete();
    console.log(`Deleted Firestore doc: ${doc.id}`);
  });

  console.log("All test users deleted ✅");
}

deleteAllTestUsers().catch(console.error);