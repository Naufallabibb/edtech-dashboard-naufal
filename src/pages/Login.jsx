import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { loginUser, clearError } from '../store/slices/authSlice';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { toast } from 'sonner';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner, faEnvelope, faLock, faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (error) {
      const errorMessage = error.includes('invalid-credential') || error.includes('user-not-found') || error.includes('wrong-password')
        ? 'Email atau password salah'
        : error.includes('too-many-requests')
        ? 'Terlalu banyak percobaan login. Coba lagi nanti'
        : 'Gagal login. Silakan coba lagi';
      
      toast.error('Login Gagal', { description: errorMessage });
      dispatch(clearError());
    }
  }, [error, dispatch]);

  const validateForm = () => {
    const newErrors = {};
    
    if (!email) {
      newErrors.email = 'Email wajib diisi';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Format email tidak valid';
    }
    
    if (!password) {
      newErrors.password = 'Password wajib diisi';
    } else if (password.length < 6) {
      newErrors.password = 'Password minimal 6 karakter';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      await dispatch(loginUser({ email, password })).unwrap();
      toast.success('Login Berhasil', { description: 'Selamat datang kembali!' });
      navigate('/dashboard');
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  return (
    <div className="min-h-screen flex bg-slate-50 dark:bg-slate-950">
      {/* Left Section - Illustration (Hidden on mobile/tablet) */}
      <div className="hidden lg:flex lg:w-1/2 bg-white dark:bg-slate-900 items-center justify-center p-8 xl:p-12">
        <div className="max-w-md w-full">
          <div className="mb-6">
            <img 
              src="/edtech_logo.svg" 
              alt="Studyo.io Logo" 
              className="h-7 mb-6"
            />
            <h1 className="text-2xl xl:text-3xl font-bold text-slate-900 dark:text-slate-100 mb-2 leading-tight">
              Halo, Selamat Datang<br />Kembali di Edtech
            </h1>
            <p className="text-slate-600 dark:text-slate-400 text-sm xl:text-base">
              Platform Pembelajaran Matematika Interaktif
            </p>
          </div>
          
          <div className="flex items-center justify-center mt-6">
            <img 
              src="/edtech_login.png" 
              alt="Login Illustration" 
              className="w-full max-w-[280px] xl:max-w-xs"
            />
          </div>
        </div>
      </div>

      {/* Right Section - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-4 sm:p-8 lg:p-10">
        <div className="w-full max-w-[440px]">
          {/* Logo for mobile/tablet only */}
          <div className="lg:hidden text-center mb-6 sm:mb-8">
            <img 
              src="/edtech_logo.svg" 
              alt="Studyo.io Logo" 
              className="h-8 sm:h-9 mx-auto"
            />
          </div>

          {/* 1. Title Section (outside card) */}
          <div className="mb-4 sm:mb-5">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100 mb-1.5">
              Masuk ke Edtech
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
              Silahkan masukkan informasi akun kamu.
            </p>
          </div>

          {/* 2. Form Card */}
          <div className="bg-white dark:bg-slate-900 rounded-xl sm:rounded-2xl shadow-lg sm:shadow-xl border border-slate-200 dark:border-slate-800 p-6 sm:p-7 lg:p-8">
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
              <div className="space-y-1.5 sm:space-y-2">
                <Label htmlFor="email" className="text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300">
                  Email <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <FontAwesomeIcon icon={faEnvelope} className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 sm:h-[18px] sm:w-[18px] text-slate-400 dark:text-slate-500" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="admin@edtech.com"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (errors.email) setErrors({ ...errors, email: '' });
                    }}
                    className={`pl-10 sm:pl-11 h-11 sm:h-12 text-sm sm:text-base bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 ${errors.email ? 'border-red-500 dark:border-red-500' : ''}`}
                  />
                </div>
                {errors.email && <p className="text-xs sm:text-sm text-red-600 dark:text-red-400">⚠ {errors.email}</p>}
              </div>

              <div className="space-y-1.5 sm:space-y-2">
                <Label htmlFor="password" className="text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300">
                  Password <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <FontAwesomeIcon icon={faLock} className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 sm:h-[18px] sm:w-[18px] text-slate-400 dark:text-slate-500" />
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (errors.password) setErrors({ ...errors, password: '' });
                    }}
                    className={`pl-10 sm:pl-11 pr-10 sm:pr-11 h-11 sm:h-12 text-sm sm:text-base bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 ${errors.password ? 'border-red-500 dark:border-red-500' : ''}`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300"
                  >
                    <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} className="h-4 w-4 sm:h-[18px] sm:w-[18px]" />
                  </button>
                </div>
                {errors.password && <p className="text-xs sm:text-sm text-red-600 dark:text-red-400">⚠ {errors.password}</p>}
              </div>

              <Button 
                type="submit" 
                className="w-full h-11 sm:h-12 text-sm sm:text-base font-medium bg-linear-to-r from-[#36aee0] to-[#a347e6] hover:from-[#2a9bd9] hover:to-[#9230d4] text-white shadow-md sm:shadow-lg"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <FontAwesomeIcon icon={faSpinner} className="mr-2 h-4 w-4 sm:h-5 sm:w-5 animate-spin" />
                    Memproses...
                  </>
                ) : (
                  'Masuk ke Dashboard'
                )}
              </Button>
            </form>
          </div>

          {/* 3. Copyright Section (outside card) */}
          <p className="text-center text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-5 sm:mt-6">
            © 2025 EdTech Indonesia. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;