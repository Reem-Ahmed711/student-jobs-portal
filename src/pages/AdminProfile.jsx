// import React, { useState } from 'react';
// import Navbar from '../components/Navbar';
// import '../styles/main.css';

// const AdminProfile = () => {
//   const [activeTab] = useState('dashboard');

//   const users = [
//     { id: 1, name: 'Reem Ahmed', email: 'reem@university.edu', role: 'Student', status: 'Active' },
//     { id: 2, name: 'Fatma Abdelmotagly', email: 'fatma@university.edu', role: 'Employer', status: 'Active' },
//     { id: 3, name: 'Dina Ebrahim', email: 'dina@university.edu', role: 'Student', status: 'Inactive' },
//     { id: 4, name: 'Sarah Mahmoud', email: 'sarah@university.edu', role: 'Employer', status: 'Active' },
//   ];

//   return (
//     <div style={{ display: 'flex', background: 'var(--gray)', minHeight: '100vh' }}>
//       <Navbar userType="admin" />
      
//       <div style={{ 
//         marginLeft: '250px', 
//         padding: '30px',
//         width: 'calc(100% - 250px)'
//       }}>
//         <div style={{
//           display: 'flex',
//           justifyContent: 'space-between',
//           alignItems: 'center',
//           marginBottom: '30px'
//         }}>
//           <h1 style={{ fontSize: '28px', color: 'var(--navy)' }}>
//             Admin Dashboard
//           </h1>
//           <div style={{
//             display: 'flex',
//             alignItems: 'center',
//             gap: '15px'
//           }}>
//             <span><i className="fas fa-bell"></i></span>
//             <div style={{
//               width: '40px',
//               height: '40px',
//               background: 'var(--light-blue)',
//               borderRadius: '50%',
//               display: 'flex',
//               alignItems: 'center',
//               justifyContent: 'center',
//               fontSize: '20px',
//               cursor: 'pointer'
//             }}>
//               <i className="fas fa-user"></i>
//             </div>
//           </div>
//         </div>

//         <div style={{
//           display: 'grid',
//           gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
//           gap: '20px',
//           marginBottom: '30px'
//         }}>
//           {[
//             { label: 'Total Users', value: '1,234', icon: <i className="fas fa-users"></i>, change: '+12%' },
//             { label: 'Active Jobs', value: '156', icon: <i className="fas fa-briefcase"></i>, change: '+5%' },
//             { label: 'Applications', value: '892', icon: <i className="fas fa-file-alt"></i>, change: '+23%' },
//             { label: 'Employers', value: '89', icon: <i className="fas fa-building"></i>, change: '+8%' }
//           ].map((stat, index) => (
//             <div key={index} className="card">
//               <div style={{
//                 display: 'flex',
//                 justifyContent: 'space-between',
//                 alignItems: 'center',
//                 marginBottom: '15px'
//               }}>
//                 <span style={{ fontSize: '32px' }}>{stat.icon}</span>
//                 <span style={{
//                   padding: '4px 8px',
//                   background: '#d4edda',
//                   color: '#155724',
//                   borderRadius: '20px',
//                   fontSize: '12px'
//                 }}>
//                   {stat.change}
//                 </span>
//               </div>
//               <h3 style={{ fontSize: '28px', color: 'var(--navy)', marginBottom: '5px' }}>
//                 {stat.value}
//               </h3>
//               <p style={{ color: '#666', fontSize: '14px' }}>{stat.label}</p>
//             </div>
//           ))}
//         </div>

//         <div style={{
//           display: 'grid',
//           gridTemplateColumns: '1fr 1fr',
//           gap: '20px',
//           marginBottom: '30px'
//         }}>
//           <div className="card">
//             <h3 style={{ marginBottom: '20px', color: 'var(--navy)' }}>Applications Overview</h3>
//             <div style={{ height: '200px', display: 'flex', alignItems: 'flex-end', gap: '10px' }}>
//               {[65, 45, 75, 55, 85, 70].map((height, index) => (
//                 <div key={index} style={{ flex: 1 }}>
//                   <div style={{
//                     height: `${height}%`,
//                     background: 'var(--navy)',
//                     borderRadius: '4px 4px 0 0',
//                     marginBottom: '5px'
//                   }}></div>
//                   <p style={{ fontSize: '12px', textAlign: 'center' }}>
//                     {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][index]}
//                   </p>
//                 </div>
//               ))}
//             </div>
//           </div>

//           <div className="card">
//             <h3 style={{ marginBottom: '20px', color: 'var(--navy)' }}>User Distribution</h3>
//             <div>
//               {[
//                 { label: 'Students', value: 65, color: 'var(--navy)' },
//                 { label: 'Employers', value: 25, color: '#4a90e2' },
//                 { label: 'Admins', value: 10, color: '#50c878' }
//               ].map((item, index) => (
//                 <div key={index} style={{ marginBottom: '15px' }}>
//                   <div style={{
//                     display: 'flex',
//                     justifyContent: 'space-between',
//                     marginBottom: '5px'
//                   }}>
//                     <span>{item.label}</span>
//                     <span>{item.value}%</span>
//                   </div>
//                   <div style={{
//                     width: '100%',
//                     height: '8px',
//                     background: '#eee',
//                     borderRadius: '4px'
//                   }}>
//                     <div style={{
//                       width: `${item.value}%`,
//                       height: '100%',
//                       background: item.color,
//                       borderRadius: '4px'
//                     }}></div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>

//         <div className="card">
//           <h3 style={{ marginBottom: '20px', color: 'var(--navy)' }}>Manage Users</h3>
//           <table style={{ width: '100%', borderCollapse: 'collapse' }}>
//             <thead>
//               <tr style={{ borderBottom: '2px solid #eee' }}>
//                 <th style={{ textAlign: 'left', padding: '12px' }}>Name</th>
//                 <th style={{ textAlign: 'left', padding: '12px' }}>Email</th>
//                 <th style={{ textAlign: 'left', padding: '12px' }}>Role</th>
//                 <th style={{ textAlign: 'left', padding: '12px' }}>Status</th>
//                 <th style={{ textAlign: 'left', padding: '12px' }}>Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {users.map(user => (
//                 <tr key={user.id} style={{ borderBottom: '1px solid #eee' }}>
//                   <td style={{ padding: '12px' }}>{user.name}</td>
//                   <td style={{ padding: '12px' }}>{user.email}</td>
//                   <td style={{ padding: '12px' }}>{user.role}</td>
//                   <td style={{ padding: '12px' }}>
//                     <span style={{
//                       padding: '4px 8px',
//                       background: user.status === 'Active' ? '#d4edda' : '#f8d7da',
//                       color: user.status === 'Active' ? '#155724' : '#721c24',
//                       borderRadius: '20px',
//                       fontSize: '12px'
//                     }}>
//                       {user.status}
//                     </span>
//                   </td>
//                   <td style={{ padding: '12px' }}>
//                     <button style={{
//                       padding: '4px 8px',
//                       marginRight: '5px',
//                       background: 'var(--navy)',
//                       color: 'white',
//                       border: 'none',
//                       borderRadius: '4px',
//                       cursor: 'pointer'
//                     }}>Edit</button>
//                     <button style={{
//                       padding: '4px 8px',
//                       background: '#dc3545',
//                       color: 'white',
//                       border: 'none',
//                       borderRadius: '4px',
//                       cursor: 'pointer'
//                     }}>Delete</button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AdminProfile;