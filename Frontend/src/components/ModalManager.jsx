import React from 'react';

export default function ModalManager({ 
  trailerModal, closeTrailer, 
  infoModal, closeInfo, openStreaming,
  streamingModal, closeStreaming 
}) {

  // Segédfüggvény: Streaming adatok egységesítése
  // Ez kezeli azt, hogy a backend 'platform_lista'-t küld, de a kód máshol 'platformok'-at használhat
  const getPlatformList = (movie) => {
    if (!movie) return [];
    return movie.platform_lista || movie.platformok || [];
  };

  return (
    <>
      {/* 1. TRAILER MODAL */}
      {trailerModal.isOpen && (
        <div className="modal active" onClick={closeTrailer}>
          <div className="modal-content modal-lg" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{trailerModal.title} - Előzetes</h3>
              <button className="close-modal" onClick={closeTrailer}><i className="fas fa-times"></i></button>
            </div>
            <div className="video-container">
              <iframe 
                width="100%" height="500" 
                src={`https://www.youtube.com/embed/${trailerModal.videoId}?autoplay=1`} 
                title="Trailer" frameBorder="0" allowFullScreen
              ></iframe>
            </div>
          </div>
        </div>
      )}

      {/* 2. INFO MODAL */}
      {infoModal.isOpen && infoModal.movie && (
        <div className="modal active" onClick={closeInfo}>
          <div className="modal-content modal-md" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{infoModal.movie.cim || infoModal.movie.title} - Részletek</h3>
              <button className="close-modal" onClick={closeInfo}><i className="fas fa-times"></i></button>
            </div>
            <div className="info-layout">
              <div className="info-poster">
                <img src={infoModal.movie.poszter_url || infoModal.movie.poster} alt={infoModal.movie.cim || infoModal.movie.title} />
              </div>
              <div className="info-text">
                <h2>{infoModal.movie.cim || infoModal.movie.title}</h2>
                <div className="info-meta">
                    <span>{infoModal.movie.megjelenes_ev || infoModal.movie.year}</span>
                    <span>{infoModal.movie.rating} <i className="fas fa-star" style={{color:'#f5c518'}}></i></span>
                    <span>{infoModal.movie.kategoria || infoModal.movie.genre}</span>
                </div>
                <p className="info-desc">{infoModal.movie.leiras || infoModal.movie.description}</p>
                <div className="info-credits">
                    <p><strong>Rendező:</strong> {infoModal.movie.rendezo || infoModal.movie.director}</p>
                </div>
                <div className="info-actions">
                    <button className="btn-modal-action" onClick={() => openStreaming(infoModal.movie)}>
                        <i className="fas fa-play"></i> Megnézem most
                    </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. STREAMING MODAL (JAVÍTVA) */}
      {streamingModal.isOpen && streamingModal.movie && (
        <div className="modal active" onClick={closeStreaming}>
          <div className="modal-content modal-sm" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Hol nézheted meg?</h3>
              <button className="close-modal" onClick={closeStreaming}><i className="fas fa-times"></i></button>
            </div>
            
            <div className="streaming-services">
              {/* Lekérjük a listát a segédfüggvénnyel */}
              {getPlatformList(streamingModal.movie).length > 0 ? (
                  getPlatformList(streamingModal.movie).map((platform, index) => {
                    // Adatmezők egységesítése:
                    // A backend { logo, url }-t küld, de az adatbázisban logo_url van.
                    // Ez a kód mindkettőt kezeli.
                    const logoSrc = platform.logo || platform.logo_url;
                    const webUrl = platform.url || platform.weboldal_url;

                    return (
                      <div 
                          key={index}
                          className="streaming-service" 
                          onClick={() => window.open(webUrl, '_blank')}
                      >
                          <div className="service-logo">
                              {logoSrc ? (
                                  <img src={logoSrc} alt={platform.nev} />
                              ) : (
                                  <i className="fas fa-tv"></i>
                              )}
                          </div>
                          <span>{platform.nev}</span>
                          <i className="fas fa-external-link-alt" style={{marginLeft:'auto', color:'#888'}}></i>
                      </div>
                    );
                  })
              ) : (
                <p style={{padding:'20px', color:'#ccc'}}>Nincs elérhető streaming adat ehhez a filmhez.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}