import { useEffect } from 'react'
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Login from "../components/Login/Login";
import { RootState } from '../types';

const LoginPage = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if(user){
      navigate("/");
    }
  }, [])
  
  return (
    <div>
        <Login />
    </div>
  )
}

export default LoginPage;