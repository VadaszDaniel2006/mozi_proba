import React, { useState, useEffect } from 'react';
import ConfirmModal from './ConfirmModal'; 

const ReviewsSidebar = ({ isOpen, onClose, movie, user, onShowNotification, onRefreshData }) => {
    const [reviews, setReviews] = useState([]);
    const [newComment, setNewComment] = useState("");
    const [rating, setRating] = useState(10); 
    const [loading, setLoading] = useState(false);
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [reviewToDelete, setReviewToDelete] = useState(null);

    useEffect(() => {
        if (isOpen && movie) {
            fetchReviews();
        } else if (!isOpen) {
            setNewComment("");
            setRating(10);
        }
    }, [isOpen, movie]);

    const fetchReviews = async () => {
        setLoading(true);
        try {
            const type = (movie.evadok_szama !== undefined || movie.sorozat_id !== undefined) ? 'sorozat' : 'film';
            const id = movie.id || movie._id;
            const res = await fetch(`http://localhost:5000/api/interactions/reviews/${type}/${id}`);
            const data = await res.json();
            setReviews(Array.isArray(data) ? data : []);
        } catch (error) { console.error(error); }
        setLoading(false);
    };

    const handleSubmit = async () => {
        if (!user) { if (onShowNotification) onShowNotification("Jelentkezz be!", "info"); return; }
        if (!newComment.trim()) { if (onShowNotification) onShowNotification("Írj szöveget!", "info"); return; }

        const type = (movie.evadok_szama !== undefined || movie.sorozat_id !== undefined) ? 'sorozat' : 'film';
        const id = movie.id || movie._id;

        try {
            const res = await fetch('http://localhost:5000/api/interactions/reviews', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId: user.id,
                    filmId: type === 'film' ? id : null,
                    sorozatId: type === 'sorozat' ? id : null,
                    comment: newComment,
                    rating: rating
                })
            });

            const result = await res.json();
            if (res.ok) {
                if (onShowNotification) onShowNotification(result.message, "success");
                setNewComment("");
                setRating(10);
                fetchReviews();
                if (onRefreshData) onRefreshData(); 
            } else {
                if (onShowNotification) onShowNotification(result.message, "info");
            }
        } catch (error) {
            if (onShowNotification) onShowNotification("Szerver hiba.", "error");
        }
    };

    const initiateDelete = (reviewId) => {
        setReviewToDelete(reviewId);
        setConfirmOpen(true);
    };

    const executeDelete = async () => {
        if (!reviewToDelete) return;
        try {
            const res = await fetch('http://localhost:5000/api/interactions/reviews', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: user.id, reviewId: reviewToDelete })
            });
            const result = await res.json();
            if (res.ok) {
                if (onShowNotification) onShowNotification(result.message, "success");
                fetchReviews(); 
                if (onRefreshData) onRefreshData(); 
            } else {
                if (onShowNotification) onShowNotification(result.message, "error");
            }
        } catch (error) {
            if (onShowNotification) onShowNotification("Hiba a törlés során.", "error");
        } finally {
            setConfirmOpen(false);
            setReviewToDelete(null);
        }
    };

    const getInitials = (name) => {
        if (!name) return "?";
        return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
    };

    const getProfileImageUrl = (avatarData) => {
        if (!avatarData) return null;
        if (avatarData.startsWith('data:')) return avatarData;
        if (avatarData.startsWith('http')) return avatarData;
        return `http://localhost:5000${avatarData}`;
    };

    return (
        <>
            <div className={`sidebar-overlay ${isOpen ? 'open' : ''}`} onClick={onClose}>
                <div className="reviews-sidebar-container" onClick={(e) => e.stopPropagation()}>
                    <div className="reviews-header">
                        <h2>{movie?.cim}</h2>
                        <button className="close-btn-modern" onClick={onClose}>
                            <i className="fas fa-times"></i>
                        </button>
                    </div>

                    <div className="reviews-content">
                        {user ? (
                            <div className="input-card">
                                <div className="rating-row">
                                    <span className="rating-label">Értékelés:</span>
                                    <div className="stars-container">
                                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                                            <i key={num} className={`fas fa-star star-icon ${num <= rating ? 'active' : ''}`} onClick={() => setRating(num)} title={`${num} csillag`}></i>
                                        ))}
                                    </div>
                                    <span className="rating-number">{rating}/10</span>
                                </div>
                                <textarea className="modern-textarea" placeholder="Írd meg a véleményed..." value={newComment} onChange={(e) => setNewComment(e.target.value)} />
                                <button className="btn-send-review" onClick={handleSubmit}>
                                    <i className="fas fa-paper-plane"></i> KÜLDÉS
                                </button>
                            </div>
                        ) : (
                            <div className="login-prompt-card">
                                <i className="fas fa-lock" style={{marginBottom:'10px', fontSize:'1.5rem'}}></i>
                                <p>Ha szeretnéd értékelni a filmeket, akkor be kell jelentkezned!</p>
                            </div>
                        )}

                        <div className="reviews-list-container">
                            {loading ? (
                                <p style={{textAlign:'center', color:'#888'}}>Betöltés...</p>
                            ) : (
                                reviews.length > 0 ? (
                                    reviews.map((review) => (
                                        <div key={review.id} className="review-card">
                                            <div className="review-card-header">
                                                <div className="user-info">
                                                    
                                                    {review.avatar ? (
                                                        <img 
                                                            src={getProfileImageUrl(review.avatar)} 
                                                            alt={review.username} 
                                                            className="user-avatar-img"
                                                            style={{
                                                                width: '40px', 
                                                                height: '40px', 
                                                                borderRadius: '50%', 
                                                                objectFit: 'cover', 
                                                                marginRight: '10px'
                                                            }}
                                                            onError={(e) => {
                                                                e.target.style.display = 'none';
                                                                e.target.nextSibling.style.display = 'flex';
                                                            }}
                                                        />
                                                    ) : null}
                                                    
                                                    <div className="user-avatar-placeholder" style={{display: review.avatar ? 'none' : 'flex'}}>
                                                        {getInitials(review.username)}
                                                    </div>

                                                    <div>
                                                        <div className="user-name">{review.username}</div>
                                                        <div className="review-date">{new Date(review.created_at).toLocaleDateString()}</div>
                                                    </div>
                                                </div>
                                                <div className="review-stars-display">
                                                    <i className="fas fa-star"></i>
                                                    <span>{review.rating}</span>
                                                </div>
                                            </div>
                                            <p className="review-text">{review.comment}</p>
                                            
                                            {/* --- JAVÍTOTT RÉSZ: Adminok is látják a kukát --- */}
                                            {user && (user.username === review.username || user.role === 'admin') && (
                                                <button className="delete-review-icon" onClick={() => initiateDelete(review.id)} title="Törlés">
                                                    <i className="fas fa-trash"></i>
                                                </button>
                                            )}
                                        </div>
                                    ))
                                ) : (
                                    <div style={{textAlign:'center', color:'#666', marginTop:'40px'}}>
                                        <i className="far fa-comment-dots" style={{fontSize:'2rem', marginBottom:'10px'}}></i>
                                        <p>Még nincsenek vélemények.<br/>Legyél te az első!</p>
                                    </div>
                                )
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <ConfirmModal 
                isOpen={confirmOpen} 
                onClose={() => setConfirmOpen(false)} 
                onConfirm={executeDelete} 
                title="Vélemény törlése" 
                message="Biztosan törölni szeretnéd ezt a véleményt?" 
            />
        </>
    );
};

export default ReviewsSidebar;