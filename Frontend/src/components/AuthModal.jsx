import React, { useState } from 'react';
import Toast from './Toast'; // Toast beimportálása

// Kategóriák listája
const CATEGORIES = [
    { id: 'action', name: 'Akció', icon: '🔥' },
    { id: 'comedy', name: 'Vígjáték', icon: '😂' },
    { id: 'drama', name: 'Dráma', icon: '🎭' },
    { id: 'scifi', name: 'Sci-Fi', icon: '🚀' },
    { id: 'horror', name: 'Horror', icon: '👻' },
    { id: 'romance', name: 'Romantikus', icon: '❤️' },
    { id: 'animation', name: 'Animáció', icon: '🎨' },
    { id: 'thriller', name: 'Thriller', icon: '🔍' },
    { id: 'fantasy', name: 'Fantasy', icon: '🐉' },
    { id: 'docu', name: 'Dokumentum', icon: '📹' }
];

export default function AuthModal({ onClose, onLogin }) {
  const [isRegister, setIsRegister] = useState(false);
  
  // Űrlap adatok
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [favoriteCategories, setFavoriteCategories] = useState([]); 
  
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Toast állapot (üzenet és típus)
  const [toast, setToast] = useState(null);

  // Kategória váltás
  const toggleCategory = (catId) => {
    let newCategories = [...favoriteCategories];
    if (newCategories.includes(catId)) {
        newCategories = newCategories.filter(id => id !== catId);
    } else {
        if (newCategories.length < 5) newCategories.push(catId);
    }
    setFavoriteCategories(newCategories);
  };

  // --- API KOMMUNIKÁCIÓ ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // 1. Validáció
    if (isRegister) {
        if (password !== confirmPassword) {
            setError("A jelszavak nem egyeznek!");
            setLoading(false);
            return;
        }
        if (password.length < 6) {
            setError("A jelszónak legalább 6 karakternek kell lennie!");
            setLoading(false);
            return;
        }
        // --- JAVÍTÁS: KÖTELEZŐ KATEGÓRIA VÁLASZTÁS ---
        if (favoriteCategories.length === 0) {
             setError("Válassz legalább 1 kedvenc kategóriát!");
             setLoading(false);
             return;
        }
    }

    try {
        const API_URL = 'http://localhost:5000/api/auth';

        // --- REGISZTRÁCIÓ ---
        if (isRegister) {
            const response = await fetch(`${API_URL}/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: name,
                    email: email,
                    password: password,
                    username: username,
                    favoriteCategories: favoriteCategories // Elküldjük a kategóriákat
                })
            });

            const data = await response.json();

            if (response.ok) {
                // SIKERES REGISZTRÁCIÓ - Alert helyett Toast
                setToast({ message: data.message || "Sikeres regisztráció! Most már bejelentkezhetsz.", type: 'success' });
                
                setIsRegister(false); // Átváltás belépésre
                setError('');
                // Mezők ürítése
                setPassword('');
                setConfirmPassword('');
                // Opcionális: kategóriák ürítése, bár ha belépésre váltunk, nem látszik
                // setFavoriteCategories([]); 
            } else {
                setError(data.message || "Hiba történt a regisztrációkor.");
            }
        } 
        // --- BEJELENTKEZÉS ---
        else {
            const response = await fetch(`${API_URL}/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: email,
                    password: password
                })
            });

            const data = await response.json();

            if (response.ok) {
                onLogin(data);
                onClose();
            } else {
                setError(data.message || "Hibás email vagy jelszó.");
            }
        }

    } catch (err) {
        console.error("API Hiba:", err);
        setError("Nem sikerült kapcsolódni a szerverhez.");
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="modal active auth-overlay" onClick={onClose}>
      <div className="modal-content auth-card" onClick={(e) => e.stopPropagation()}>
        
        {/* TOAST MEGJELENÍTÉSE */}
        {toast && (
            <Toast 
                message={toast.message} 
                type={toast.type} 
                onClose={() => setToast(null)} 
            />
        )}

        <button className="close-auth" onClick={onClose}>
            <i className="fas fa-times"></i>
        </button>

        <div className="auth-header">
          <h2>{isRegister ? 'Fiók létrehozása' : 'Üdvözlünk újra!'}</h2>
          <p>{isRegister ? 'Regisztrálj a korlátlan filmezéshez.' : 'Jelentkezz be a folytatáshoz.'}</p>
        </div>

        {error && <div className="auth-error">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          
          {/* REGISZTRÁCIÓS MEZŐK */}
          {isRegister && (
            <>
                <div className="input-group">
                    <input 
                        type="text" 
                        placeholder=" " 
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required={isRegister} 
                    />
                    <label>Teljes név</label>
                </div>

                <div className="input-group">
                    <input 
                        type="text" 
                        placeholder=" " 
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required={isRegister}
                    />
                    <label>Felhasználónév</label>
                </div>
            </>
          )}

          {/* KÖZÖS MEZŐK */}
          <div className="input-group">
            <input 
              type="email" 
              placeholder=" " 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required 
            />
            <label>Email cím</label>
          </div>

          <div className="input-group">
            <input 
              type="password" 
              placeholder=" " 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required 
            />
            <label>Jelszó</label>
          </div>

          {/* JELSZÓ MEGERŐSÍTÉS */}
          {isRegister && (
            <div className="input-group">
              <input 
                type="password" 
                placeholder=" " 
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required={isRegister}
              />
              <label>Jelszó megerősítése</label>
            </div>
          )}

          {/* KATEGÓRIA VÁLASZTÓ - CSAK REGISZTRÁCIÓKOR */}
          {isRegister && (
             <div className="form-section" style={{textAlign: 'left', marginTop: '20px', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '15px'}}>
                <h4 style={{fontSize: '1rem', marginBottom: '10px', color: '#ddd'}}>Kedvenc kategóriák (min. 1)</h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
                    {CATEGORIES.map(cat => (
                        <div 
                            key={cat.id}
                            onClick={() => toggleCategory(cat.id)}
                            style={{
                                padding: '8px', 
                                border: `1px solid ${favoriteCategories.includes(cat.id) ? '#3e50ff' : '#444'}`,
                                borderRadius: '6px',
                                background: favoriteCategories.includes(cat.id) ? 'rgba(62, 80, 255, 0.2)' : 'rgba(255,255,255,0.05)',
                                cursor: 'pointer',
                                textAlign: 'center',
                                fontSize: '0.8rem',
                                color: 'white',
                                transition: '0.2s'
                            }}
                        >
                            {cat.icon} {cat.name}
                        </div>
                    ))}
                </div>
            </div>
          )}

          <button type="submit" className="btn-submit-auth" style={{marginTop: '20px'}} disabled={loading}>
            {loading ? 'Folyamatban...' : (isRegister ? 'Regisztráció' : 'Bejelentkezés')}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            {isRegister ? "Már van fiókod?" : "Még nincs fiókod?"}
            <span onClick={() => { setIsRegister(!isRegister); setError(''); }}>
              {isRegister ? " Lépj be itt" : " Regisztrálj most"}
            </span>
          </p>
        </div>

      </div>
    </div>
  );
}