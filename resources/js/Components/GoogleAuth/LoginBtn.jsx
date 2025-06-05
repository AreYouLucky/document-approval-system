import { useGoogleLogin } from '@react-oauth/google';

const LoginButton = ({ setAccessToken }) => {
  const login = useGoogleLogin({
    scope: 'https://www.googleapis.com/auth/drive',
    onSuccess: async (tokenResponse) => {
      setAccessToken(tokenResponse.access_token);
    },
    onError: () => alert('Login Failed'),
  });

  return <button onClick={() => login()} className=' p-10 flex h-50 w-full cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed border-gray-600 bg-white hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:hover:border-gray-500 dark:hover:bg-gray-600'>
    <img src="/storage/images/google.png" alt="" className='w-10' />
    <span className='text-base nunito-bold'>Login to Google</span>
    <span className='text-sm nunito-regular'>
      We'll check if your account is authorized to access and upload documents.
    </span>
  </button>;
};

export default LoginButton;