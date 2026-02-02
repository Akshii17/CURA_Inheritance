import React, { useEffect, useState } from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount } from 'wagmi';
import { useNavigate } from 'react-router-dom';

const SignUp = ({ mode, onClose, switchMode }) => {
  const { isConnected } = useAccount();
  const navigate = useNavigate();

  const [signupData, setSignupData] = useState({
    name: '',
    username: '',
    password: '',
    confirmPassword: '',
  });

  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const isStrongPassword = (password) => {
    const regex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?#&])[A-Za-z\d@$!%*?#&]{8,}$/;
    return regex.test(password);
  };

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);

    if (!isStrongPassword(value)) {
      setError(
        "Password must be 8+ chars, include uppercase, lowercase, number & symbol"
      );
    } else {
      setError("");
    }
  };

  const [loginData, setLoginData] = useState({
    username: '',
    password: '',
  });

  useEffect(() => {
    if (isConnected && mode === 'signup') {
      onClose();
      navigate('/');
    }
  }, [isConnected, mode, navigate, onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="relative w-full max-w-[420px] rounded-2xl border border-white/10 bg-black p-8 shadow-xl">

        {/* Close */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-500 hover:text-white"
        >
          ✕
        </button>

        {/* ================= SIGN UP ================= */}
        {mode === 'signup' && (
          <>
            <div className="mb-6 text-center">
              <h1 className="text-2xl font-bold text-white">Sign Up</h1>
              <p className="text-sm text-[#8B949E] mt-2">
                Create your Cura account
              </p>
            </div>

            <div className="flex flex-col gap-4">
              <input className="auth-input" placeholder="Name" />
              <input className="auth-input" placeholder="Username" />
              <input type="password" className="auth-input" placeholder="Password" value={password} onChange={handlePasswordChange}/>
              {error && (
  <p className="text-red-500 text-sm">
    {error}
  </p>
)}
              <input type="password" className="auth-input" placeholder="Confirm Password" />
            </div>

            <div className="mt-6">
              <ConnectButton.Custom>
                {({ openConnectModal, account }) => (
                  <button
                    onClick={openConnectModal}
                    className="w-full rounded-lg bg-gradient-to-br from-[#E8B88A] via-[#dea193] to-[#B87F4E] py-3 font-semibold text-gray-900"
                  >
                    {account ? 'Wallet Connected' : 'Sign up with Wallet'}
                  </button>
                )}
              </ConnectButton.Custom>
            </div>

            {/* Toggle */}
            <p className="mt-6 text-center text-sm text-gray-500">
              Already have an account?{' '}
              <button
                onClick={() => switchMode('login')}
                className="font-medium text-[#FFD966] hover:underline"
              >
                Login
              </button>
            </p>
          </>
        )}

        {/* ================= LOGIN ================= */}
        {mode === 'login' && (
          <>
            <div className="mb-6 text-center">
              <h1 className="text-2xl font-bold text-white">Welcome Back!</h1>
            </div>

            <div className="flex flex-col gap-4">
              <input className="auth-input" placeholder="Username" />
              <input type="password" className="auth-input" placeholder="Password" />
            </div>

            <button
            //add authorization
              onClick={() => {
                onClose();
                navigate('/');
              }}
              className="w-full rounded-lg mt-4 bg-gradient-to-br from-[#F7E7A0] via-[#FFD966] to-[#C9A227] py-3 font-semibold text-gray-900"
            >
              Login
            </button>

            {/* Toggle */}
            <p className="mt-6 text-center text-sm text-gray-500">
              Don’t have an account?{' '}
              <button
                onClick={() => switchMode('signup')}
                className="font-medium text-[#FFD966] hover:underline"
              >
                Sign up
              </button>
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default SignUp;
