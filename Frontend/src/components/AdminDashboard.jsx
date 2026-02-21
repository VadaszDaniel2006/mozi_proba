import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ConfirmModal from './ConfirmModal';
import Toast from './Toast'; // <--- 1. Beimportáljuk a Toast-ot

export default function AdminDashboard() {
    const [users, setUsers] = useState([]);
    const [error, setError] = useState('');
    
    const [editingUser, setEditingUser] = useState(null);
    const [formData, setFormData] = useState({ email: '', role: 'user', password: '' });

    // Törléshez szükséges state-ek
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [userToDelete, setUserToDelete] = useState(null);

    // <--- 2. Új state az értesítésekhez (Toast)
    const [toast, setToast] = useState(null);

    useEffect(() => {
        fetchUsers();
    }, []);

    // <--- 3. Segédfüggvény az értesítések megjelenítéséhez
    const showNotification = (message, type = 'success') => {
        setToast({ message, type });
    };

    const fetchUsers = async () => {
        const token = localStorage.getItem('token');
        try {
            const res = await fetch('http://localhost:5000/api/admin/users', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            if (res.ok) {
                setUsers(data);
                setError('');
            } else {
                setError(data.message || 'Hiba történt.');
            }
        } catch (err) {
            setError('Nem sikerült elérni a szervert.');
        }
    };

    const initiateDelete = (id) => {
        setUserToDelete(id);
        setShowDeleteModal(true);
    };

    const handleDeleteConfirmed = async () => {
        if (!userToDelete) return;

        const token = localStorage.getItem('token');
        try {
            const res = await fetch(`http://localhost:5000/api/admin/users/${userToDelete}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                setUsers(users.filter(user => user.id !== userToDelete));
                // <--- 4. Alert helyett Toast
                showNotification("Felhasználó sikeresen törölve.", "success");
            } else {
                showNotification("Hiba a törlésnél.", "error");
            }
        } catch (err) { showNotification("Szerver hiba.", "error"); }

        setShowDeleteModal(false);
        setUserToDelete(null);
    };

    const handleEditClick = (user) => {
        setEditingUser(user);
        setFormData({ 
            email: user.email, 
            role: user.role, 
            password: '' 
        });
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');

        try {
            const res = await fetch(`http://localhost:5000/api/admin/users/${editingUser.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });

            const data = await res.json();

            if (res.ok) {
                setUsers(users.map(u => u.id === editingUser.id ? { ...u, email: formData.email, role: formData.role } : u));
                setEditingUser(null); 
                // <--- 5. Alert helyett Toast (Sikeres mentés)
                showNotification("Sikeres mentés!", "success");
            } else {
                showNotification(data.message || "Hiba történt!", "error");
            }
        } catch (error) {
            showNotification("Szerver hiba a mentéskor.", "error");
        }
    };

    return (
        <div style={{ padding: '40px', maxWidth: '1200px', margin: '80px auto', color: 'white', display: 'flex', flexDirection: 'column', minHeight: '60vh' }}>
            
            <h1 style={{ borderBottom: '1px solid #333', paddingBottom: '20px', marginBottom: '30px', textAlign: 'center' }}>
                🛡️ Admin Vezérlőpult
            </h1>

            {error ? (
                <div style={{ background: '#ff4b4b', padding: '20px', borderRadius: '8px', textAlign: 'center' }}>{error}</div>
            ) : (
                <div style={{ overflowX: 'auto', background: '#161b22', borderRadius: '12px', border: '1px solid #333' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead>
                            <tr style={{ background: '#0f152b', borderBottom: '1px solid #333' }}>
                                <th style={{ padding: '15px' }}>ID</th>
                                <th style={{ padding: '15px' }}>Név / User</th>
                                <th style={{ padding: '15px' }}>Email</th>
                                <th style={{ padding: '15px' }}>Jogosultság</th>
                                <th style={{ padding: '15px', textAlign: 'right' }}>Művelet</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map(user => (
                                <tr key={user.id} style={{ borderBottom: '1px solid #222' }}>
                                    <td style={{ padding: '15px', color: '#888' }}>{user.id}</td>
                                    <td style={{ padding: '15px' }}>
                                        <div style={{fontWeight:'bold'}}>{user.nev || user.username}</div>
                                        <div style={{fontSize:'0.8rem', color:'#aaa'}}>@{user.username}</div>
                                        <div style={{fontSize:'0.7rem', color:'#666'}}>
                                            {user.regisztracio_datum ? new Date(user.regisztracio_datum).toLocaleDateString() : ''}
                                        </div>
                                    </td>
                                    <td style={{ padding: '15px', color: '#ccc' }}>{user.email}</td>
                                    <td style={{ padding: '15px' }}>
                                        <span style={{ 
                                            padding: '4px 8px', borderRadius: '4px', fontSize: '0.8rem',
                                            background: user.role === 'admin' ? '#e74c3c' : '#3e50ff',
                                            color: 'white'
                                        }}>
                                            {user.role}
                                        </span>
                                    </td>
                                    <td style={{ padding: '15px', textAlign: 'right' }}>
                                        <div style={{display:'flex', justifyContent:'flex-end', gap:'10px'}}>
                                            <button 
                                                onClick={() => handleEditClick(user)}
                                                style={{ background: '#f39c12', border: 'none', color: 'white', padding: '8px', borderRadius: '4px', cursor: 'pointer' }}
                                                title="Szerkesztés"
                                            >
                                                <i className="fas fa-edit"></i>
                                            </button>
                                            
                                            <button 
                                                onClick={() => initiateDelete(user.id)}
                                                style={{ background: '#ff4b4b', border: 'none', color: 'white', padding: '8px', borderRadius: '4px', cursor: 'pointer' }}
                                                title="Törlés"
                                            >
                                                <i className="fas fa-trash"></i>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            <div style={{ marginTop: '50px', display: 'flex', justifyContent: 'center' }}>
                <Link to="/" style={{ textDecoration: 'none' }}>
                    <button style={{
                        background: '#3e50ff', color: 'white', border: 'none', padding: '15px 30px', borderRadius: '8px',
                        fontSize: '1.1rem', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px'
                    }}>
                        <i className="fas fa-home"></i> Vissza a kezdőoldalra
                    </button>
                </Link>
            </div>

            {/* SZERKESZTŐ MODAL */}
            {editingUser && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
                    background: 'rgba(0,0,0,0.8)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 10000
                }}>
                    <div style={{ background: '#1f2a48', padding: '30px', borderRadius: '12px', width: '400px', border: '1px solid #444', boxShadow: '0 10px 40px rgba(0,0,0,0.5)' }}>
                        <h2 style={{marginTop:0, marginBottom:'20px', color: 'white'}}>
                            <i className="fas fa-user-edit"></i> Szerkesztés: {editingUser.username}
                        </h2>
                        
                        <form onSubmit={handleUpdate}>
                            <div style={{ marginBottom: '15px' }}>
                                <label style={{display:'block', marginBottom:'5px', color:'#aaa'}}>Email cím</label>
                                <input 
                                    type="email" 
                                    value={formData.email}
                                    onChange={e => setFormData({...formData, email: e.target.value})}
                                    style={{width:'100%', padding:'10px', background:'#0b0f2b', border:'1px solid #444', color:'white', borderRadius:'4px'}}
                                    required
                                />
                            </div>

                            <div style={{ marginBottom: '15px' }}>
                                <label style={{display:'block', marginBottom:'5px', color:'#aaa'}}>Jogosultság</label>
                                <select 
                                    value={formData.role}
                                    onChange={e => setFormData({...formData, role: e.target.value})}
                                    style={{width:'100%', padding:'10px', background:'#0b0f2b', border:'1px solid #444', color:'white', borderRadius:'4px'}}
                                >
                                    <option value="user">Felhasználó</option>
                                    <option value="admin">Adminisztrátor</option>
                                </select>
                            </div>

                            <div style={{ marginBottom: '20px' }}>
                                <label style={{display:'block', marginBottom:'5px', color:'#aaa'}}>Új jelszó (Hagyd üresen, ha nem változik)</label>
                                <input 
                                    type="password" 
                                    placeholder="******"
                                    value={formData.password}
                                    onChange={e => setFormData({...formData, password: e.target.value})}
                                    style={{width:'100%', padding:'10px', background:'#0b0f2b', border:'1px solid #444', color:'white', borderRadius:'4px'}}
                                />
                            </div>

                            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                                <button 
                                    type="button" 
                                    onClick={() => setEditingUser(null)}
                                    style={{ background: 'transparent', border: '1px solid #666', color: '#ccc', padding: '10px 20px', borderRadius: '6px', cursor: 'pointer' }}
                                >
                                    Mégse
                                </button>
                                <button 
                                    type="submit" 
                                    style={{ background: '#3e50ff', border: 'none', color: 'white', padding: '10px 20px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}
                                >
                                    Mentés
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* CONFIRM MODAL (TÖRLÉS) */}
            <ConfirmModal 
                isOpen={showDeleteModal} 
                onClose={() => setShowDeleteModal(false)} 
                onConfirm={handleDeleteConfirmed} 
                title="Felhasználó törlése" 
                message="Biztosan véglegesen törölni szeretnéd ezt a felhasználót? Ez a művelet nem vonható vissza." 
            />

            {/* <--- 6. TOAST MODAL (ÉRTESÍTÉSEK) */}
            {toast && (
                <Toast 
                    message={toast.message} 
                    type={toast.type} 
                    onClose={() => setToast(null)} 
                />
            )}

        </div>
    );
}