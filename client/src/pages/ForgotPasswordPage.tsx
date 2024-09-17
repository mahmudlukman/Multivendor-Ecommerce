import { useState } from 'react';
import styles from '../styles/styles';
import { Link } from 'react-router-dom';
import { useForgotPasswordMutation } from '../redux/features/auth/authApi';
import { toast } from 'react-hot-toast';
import { BeatLoader } from 'react-spinners';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [forgotPassword, { isLoading }] = useForgotPasswordMutation();

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    const data = {
      email,
    };
    try {
      const result = await forgotPassword(data).unwrap();
      toast.success(result.message || 'Password reset email sent successfully');
    } catch (error: any) {
      toast.error(error.data?.message || 'Something went wrong!');
    }
    await forgotPassword(data);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Forgot Password
        </h2>
      </div>
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email address
              </label>
              <div className="mt-1">
                <input
                  type="email"
                  name="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
            </div>
            <div>
              <button
                type="submit"
                className="group relative w-full h-[40px] flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                {isLoading ? <BeatLoader color="white" /> : 'Send Reset Link'}
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

export default ForgotPasswordPage;
