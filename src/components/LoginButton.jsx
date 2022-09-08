import { useState, useEffect } from 'react';

/**
 * button component on login page
 */
const LoginButton = ({ onClick }) => {

  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [items, setItems] = useState([]);


  //redirects to login endpoint 
  useEffect(() => {
    const frontend = 'http://localhost:3000/';
    fetch(frontend + 'login', {
      method: 'GET',
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
      }
    })
      .then(res => res.json())
      .then(
        (result) => {
          setIsLoaded(true);
          setItems(result);
        },
        (error) => {
          setIsLoaded(true);
          setError(error);
        }
      )
  }, []);

  return (
    <div className="center">
      <button onClick={onClick} className="btn">
        Log in with Spotify →
      </button>
    </div>

  )
}

export default LoginButton