import { useEffect } from "react";

/**
 * redirects to backend for login
 */
function Login() {

  const backend = 'http://localhost:8888/'

  //redirects to the backend /login endpoint
  useEffect(() => {
    window.location.href = backend + 'login';
  }, []);

  return (
    <div></div>
  );
}

export default Login;