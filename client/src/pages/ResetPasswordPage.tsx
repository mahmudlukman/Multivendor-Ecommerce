import { useEffect, useState } from 'react';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import styles from '../styles/styles';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { useResetPasswordMutation } from '../redux/features/auth/authApi';
import { BeatLoader } from 'react-spinners';


const ResetPasswordPage = () => {
  const navigate = useNavigate()
  const [password, setPassword] = useState('');
  const [visible, setVisible] = useState(false);
  const [resetPassword, { isLoading }] =
    useResetPasswordMutation();

  const [searchParams] = useSearchParams();
  const token = searchParams?.get('token');
  const userId = searchParams?.get('id');

  useEffect(() => {
    if (!userId) {
      toast.error('Invalid reset password link!');
      navigate('/');
    }
  }, [userId]);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (!token) {
      toast.error('Missing reset token');
      return;
    }
    if (!userId) {
      toast.error('Missing User Id');
      return;
    }
  
    try {
      const result = await resetPassword({
        userId,
        token,
        newPassword: password
      }).unwrap();
      toast.success(result.message || 'Password reset successful');
    } catch (error: any) {
      toast.error(error.data?.message || 'Something went wrong!');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Reset Your Password
        </h2>
      </div>
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <div className="mt-1 relative">
                <input
                  type={visible ? 'text' : 'password'}
                  name="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
                {visible ? (
                  <AiOutlineEye
                    className="absolute right-2 top-2 cursor-pointer"
                    size={25}
                    onClick={() => setVisible(false)}
                  />
                ) : (
                  <AiOutlineEyeInvisible
                    className="absolute right-2 top-2 cursor-pointer"
                    size={25}
                    onClick={() => setVisible(true)}
                  />
                )}
              </div>
            </div>
            <div>
              <button
                type="submit"
                className="group relative w-full h-[40px] flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                {isLoading ? <BeatLoader color="white" /> : 'Submit'}
              </button>
            </div>
            <div className={`${styles.noramlFlex} w-full`}>
              <h4>Go back to login</h4>
              <Link to="/login" className="text-blue-600 pl-2">
                Login
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
