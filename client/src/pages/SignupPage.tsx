import { useEffect } from 'react'
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Signup from "../components/Signup/Signup";

const SignupPage = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state: any) => state.auth);

  useEffect(() => {
    if(user){
      navigate("/");
    }
  }, [])
  return (
    <div>
        <Signup />
    </div>
  )
}

export default SignupPage