import Spotify from './spotify_logo.png'

/**
 * header containing app name and logo
 * present on every page
 */
const Header = () => {
  return (
    <div className="header">
      <img src={Spotify} alt="logoimage" className="logo"></img>
      <h1 className="name">
        Sp-ART-ify
      </h1>
    </div>

  )
}

export default Header