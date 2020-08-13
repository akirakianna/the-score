import React from 'react'
import { withRouter } from 'react-router-dom'

const Footer = () => {

  return <>
    <footer>
      <div>
        <p>All Rights Reserved <a href="https://www.themoviedb.org/" target="_blank" rel="noopener noreferrer">TMDB</a> & <a href="https://www.spotify.com/uk/" target="_blank" rel="noopener noreferrer">Spotify</a></p>
      </div>
      <div>
        <p className="by">🌜<a href="https://github.com/akirakianna" target="_blank" rel="noopener noreferrer">4kir4</a> x <a href="https://github.com/larathompson" target="_blank" rel="noopener noreferrer">Lara</a> x <a href="https://github.com/shaikhqayum" target="_blank" rel="noopener noreferrer">Shaikh</a> x <a href="https://github.com/cruickshankprc" target="_blank" rel="noopener noreferrer">SilkenTofu</a> 🌛</p>
      </div>
    </footer>
  </>
}
export default withRouter(Footer)