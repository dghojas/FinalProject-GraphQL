import React, { useContext, useState } from 'react';
import { AuthContext } from '../../context/authContext';
import { Link, useHistory } from 'react-router-dom';
import { toast } from 'react-toastify';
import { auth, googleAuthProvider } from '../../firebase';
import AuthForm from '../../components/forms/AuthForm';

const Login = () => {
  const { dispatch } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  let history = useHistory();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await auth.signInWithEmailAndPassword(email, password)
        .then(async (result) => {
          const { user } = result;
          const idTokenResult = await user.getIdTokenResult();

          dispatch({
            type: 'LOGGED_IN_USER',
            payload: {
              email: user.email,
              token: idTokenResult.token
            }
          });

          history.push('/');
        });
    } catch (error) {
      console.log(`Login error ${error}`);
      toast.error(error.message);
      setLoading(false);
    }
  };

  const googleLogin = () => {
    auth.signInWithPopup(googleAuthProvider)
      .then(async (result) => {
        const { user } = result;
        const idTokenResult = await user.getIdTokenResult();

        dispatch({
          type: 'LOGGED_IN_USER',
          payload: {
            email: user.email,
            token: idTokenResult.token
          }
        });

        // send user info to our server with mongodb to either update/create
        history.push('/profile');
      });
  };

  return (
    <div className="container mt-5 mt-md-0">
      {loading ? <h4 className="text-danger">Loading...</h4> : <h4>Login</h4>}
      <button className="btn btn-raised btn-danger my-5" onClick={googleLogin}>
        Login with Google
      </button>
      <AuthForm
        email={email}
        password={password}
        loading={loading}
        setEmail={setEmail}
        setPassword={setPassword}
        handleSubmit={handleSubmit}
        showPasswordInput="true"
      />
      <Link className="text-danger float-right" to="/password/forgot">
        Forgot Password
      </Link>
    </div>
  );
};

export default Login;
