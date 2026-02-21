import React, { useState, useEffect } from 'react';

const MovieCard = ({ 
  movie, 
  user, 
  onOpenInfo, 
  onOpenTrailer, 
  onOpenStreaming, 
  onAddToFav, 
  onRemoveFromFav, 
  onAddToList, 
  onRemoveFromList,
  onOpenReviews,
  interactionUpdate // <--- ÚJ PROP
}) => {
  
  const [status, setStatus] = useState({
    reviewed: false,
    favorite: false,
    listed: false
  });

  // Státusz ellenőrzése (Most már az interactionUpdate-re is figyel!)
  useEffect(() => {
    if (user && movie) {
        fetchStatus();
    }
  }, [user, movie, interactionUpdate]); // <--- ITT A VÁLTOZÁS

  const fetchStatus = async () => {
    try {
        const type = (movie.evadok_szama !== undefined || movie.sorozat_id !== undefined) ? 'sorozat' : 'film';
        const id = movie.id || movie._id;

        const res = await fetch('http://localhost:5000/api/interactions/status', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                userId: user.id,
                filmId: type === 'film' ? id : null,
                sorozatId: type === 'sorozat' ? id : null
            })
        });
        
        if (res.ok) {
            const data = await res.json();
            setStatus(data); 
        }
    } catch (error) { console.error(error); }
  };

  const handleFavClick = (e) => {
      e.stopPropagation();
      if (!user) return onAddToFav(movie); 

      if (status.favorite) {
          setStatus(prev => ({ ...prev, favorite: false }));
          onRemoveFromFav(movie);
      } else {
          setStatus(prev => ({ ...prev, favorite: true }));
          onAddToFav(movie);
      }
  };

  const handleListClick = (e) => {
      e.stopPropagation();
      if (!user) return onAddToList(movie);

      if (status.listed) {
          setStatus(prev => ({ ...prev, listed: false }));
          onRemoveFromList(movie);
      } else {
          setStatus(prev => ({ ...prev, listed: true }));
          onAddToList(movie);
      }
  };

  const handleReviewClick = (e) => {
      e.stopPropagation();
      if (onOpenReviews) onOpenReviews(movie);
  };

  const activeStyle = { color: '#00e676', fontWeight: 'bold' }; 

  if (!movie) return null;

  return (
    <div className="movie-card-container">
      <div 
        className="movie-card" 
        onClick={() => onOpenTrailer && onOpenTrailer(movie.elozetes_url, movie.cim)}
      >
        <div className="card-image">
          <img src={movie.poszter_url || movie.poster} alt={movie.cim} />
          <div className="card-overlay">
            <i className="fas fa-play-circle"></i>
          </div>
        </div>

        <div className="user-interactions" onClick={(e) => e.stopPropagation()}>
            
            <button 
                className="btn-icon reviews" 
                onClick={handleReviewClick} 
                title="Vélemények"
                style={{ marginRight: '5px', ...(status.reviewed ? activeStyle : {}) }}
            >
                <i className="fas fa-comment-alt"></i>
            </button>

            {user && (
                <>
                    <button 
                        className="btn-fav" 
                        onClick={handleFavClick} 
                        title="Kedvencek"
                    >
                        <i 
                            className="fas fa-heart"
                            style={status.favorite ? activeStyle : {}}
                        ></i>
                    </button>
                    <button 
                        className="btn-add-list" 
                        onClick={handleListClick} 
                        title="Saját lista"
                    >
                        <i 
                            className="fas fa-plus"
                            style={status.listed ? activeStyle : {}}
                        ></i>
                    </button>
                </>
            )}
        </div>
      </div>

      <div className="card-details">
        <h4>{movie.cim || movie.title}</h4>
        <div className="card-meta">
          <span>{movie.megjelenes_ev || movie.year}</span>
          <span><i className="fas fa-star"></i> {movie.rating}</span>
        </div>
      </div>

      <div className="card-buttons">
        <button 
            className="btn-card-play" 
            onClick={(e) => { 
                e.stopPropagation(); 
                if (onOpenStreaming) onOpenStreaming(movie); 
            }}
        >
          <i className="fas fa-play"></i> Megnézem
        </button>
        
        <button 
            className="btn-card-info" 
            onClick={(e) => { 
                e.stopPropagation(); 
                if (onOpenInfo) onOpenInfo(movie); 
            }}
        >
          <i className="fas fa-info-circle"></i> Részletek
        </button>
      </div>
    </div>
  );
};

export default MovieCard;