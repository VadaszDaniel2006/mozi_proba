import React, { useState } from 'react';
import { Link } from 'react-router-dom'; // FONTOS: Link importálása
import logoImg from '../logo.png'; 
import ProfilDropdown from './ProfilDropdown';

export default function Navbar({ scrolled, user, onOpenAuth, onLogout, onUpdateProfile, onOpenFavorites, onOpenMyList }) {
  const [searchActive, setSearchActive] = useState(false);
  const [searchValue, setSearchValue] = useState('');

  return (
    <nav className={scrolled ? 'scrolled' : ''}>
      <div className="nav-container">
        
        {/* BAL OLDAL (Logó + Menü) */}
        <div className="nav-left">
            {/* JAVÍTÁS: <a href> helyett <Link to>, így nem tölt újra az oldal */}
            <Link to="/" className="logo-link">
                <div className="logo">
                    <img src={logoImg} alt="MoziPont Logo" />
                </div>
            </Link>
            <ul className="nav-links">
                {/* A Kezdőlap gombot is Link-re cseréltem a biztonság kedvéért */}
                <li><Link to="/">Kezdőlap</Link></li>
                <li><a href="#series">Sorozatok</a></li>
                <li><a href="#movies">Filmek</a></li>
                <li><a href="#list">Saját lista</a></li>
            </ul>
        </div>

        {/* JOBB OLDAL (Kereső + Profil) */}
        <div className="nav-right">
            {/* Keresőmező */}
            <div className={`search-box ${searchActive ? 'active' : ''}`}>
                <button className="search-btn" onClick={() => setSearchActive(!searchActive)}>
                    <i className="fas fa-search"></i>
                </button>
                <input 
                    type="text" 
                    placeholder="Címek, emberek, műfajok..." 
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                />
            </div>
            
            {/* Feltételes megjelenítés: User menü VAGY Belépés gomb */}
            {user ? (
                <ProfilDropdown 
                    user={user} 
                    onLogout={onLogout} 
                    onOpenProfile={onUpdateProfile} 
                    onOpenFavorites={onOpenFavorites} 
                    onOpenMyList={onOpenMyList}       
                />
            ) : (
                <button className="btn-login" onClick={onOpenAuth}>
                    Bejelentkezés
                </button>
            )}
        </div>
      </div>
    </nav>
  );
}