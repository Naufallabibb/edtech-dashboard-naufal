import { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logoutUser } from '../store/slices/authSlice';
import { Button } from './ui/button';
import { Separator } from './ui/separator';
import { Skeleton } from './ui/skeleton';
import { ModeToggle } from './mode-toggle';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from './ui/alert-dialog';
import { toast } from 'sonner';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTableColumns, faUsers, faCalendar, faRightFromBracket, faBars, faXmark, faTriangleExclamation, faSpinner } from '@fortawesome/free-solid-svg-icons';

const getAvatarUrl = (name) => {
  const username = name?.replace(/\s+/g, '+') || 'User';
  return `https://avatar.iran.liara.run/public?username=${username}`;
};

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [layoutLoading, setLayoutLoading] = useState(true);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLayoutLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  const menuItems = [
    { path: '/dashboard', label: 'Dashboard', icon: faTableColumns },
    { path: '/tutors', label: 'Tutors', icon: faUsers },
    { path: '/bookings', label: 'Bookings', icon: faCalendar },
  ];

  const handleLogoutClick = () => {
    setShowLogoutDialog(true);
  };

  const handleLogoutConfirm = async () => {
    setIsLoggingOut(true);
    try {
      await dispatch(logoutUser()).unwrap();
      toast.success('Logout Berhasil', { description: 'Sampai jumpa lagi!' });
      navigate('/login');
    } catch (error) {
      toast.error('Logout Gagal', { description: error });
    } finally {
      setIsLoggingOut(false);
      setShowLogoutDialog(false);
    }
  };

  const getPageTitle = () => {
    const currentPath = location.pathname;
    const item = menuItems.find(item => item.path === currentPath);
    return item ? item.label : 'Dashboard';
  };

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 dark:bg-slate-950">
      {/* Sidebar */}
      <aside className={`${sidebarOpen ? 'w-64' : 'w-0'} bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 transition-all duration-300 flex flex-col overflow-hidden md:relative absolute z-50 h-full shadow-lg`}>
        {layoutLoading ? (
          <>
            <div className="p-6 flex items-center justify-between border-b border-slate-200 dark:border-slate-800">
              <Skeleton className="h-8 w-32 bg-slate-200 dark:bg-slate-800" />
              <Skeleton className="h-8 w-8 md:hidden bg-slate-200 dark:bg-slate-800" />
            </div>

            {/* Menu Skeleton */}
            <nav className="flex-1 p-4 space-y-2">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-10 w-full rounded-lg bg-slate-200 dark:bg-slate-800" />
              ))}
            </nav>

            <Separator />

            {/* User Profile Skeleton */}
            <div className="p-4 space-y-3 border-t border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800">
                <Skeleton className="h-10 w-10 rounded-full bg-slate-200 dark:bg-slate-700" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-24 bg-slate-200 dark:bg-slate-700" />
                  <Skeleton className="h-3 w-32 bg-slate-200 dark:bg-slate-700" />
                </div>
              </div>
              <Skeleton className="h-10 w-full rounded-lg bg-slate-200 dark:bg-slate-800" />
            </div>
          </>
        ) : (
          <>
            <div className="p-6 flex items-center justify-between border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <img src="/edtech_logo.svg" alt="EdTech" className="h-8" />
              </div>
              <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(false)} className="md:hidden">
                <FontAwesomeIcon icon={faXmark} className="h-5 w-5" />
              </Button>
            </div>

            {/* Menu */}
            <nav className="flex-1 p-4 space-y-2">
              {menuItems.map((item) => {
                const isActive = location.pathname === item.path;
                
                return (
                  <Button
                    key={item.path}
                    variant={isActive ? 'default' : 'ghost'}
                    className={`w-full justify-start ${isActive ? 'bg-linear-to-r from-studyo-blue to-studyo-purple text-white hover:from-[#2a9bd9] hover:to-[#9230d4]' : ''}`}
                    onClick={() => {
                      navigate(item.path);
                      if (window.innerWidth < 768) setSidebarOpen(false);
                    }}
                  >
                    <FontAwesomeIcon icon={item.icon} className="mr-3 h-5 w-5" />
                    {item.label}
                  </Button>
                );
              })}
            </nav>

            <Separator />

            {/* User Profile */}
            <div className="p-4 space-y-3 border-t border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800">
                <img 
                  src={getAvatarUrl(user?.displayName)}
                  alt={user?.displayName}
                  className="h-10 w-10 rounded-full object-cover ring-2 ring-slate-200 dark:ring-slate-700"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://avatar.iran.liara.run/public';
                  }}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold truncate">{user?.displayName || 'Admin'}</p>
                  <p className="text-xs text-slate-500 truncate">{user?.email}</p>
                </div>
              </div>
              
              <Button 
                variant="outline" 
                className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/20 border-red-200 dark:border-red-900" 
                onClick={handleLogoutClick}
              >
                <FontAwesomeIcon icon={faRightFromBracket} className="mr-3 h-5 w-5" />
                Logout
              </Button>
            </div>
          </>
        )}
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-16 border-b bg-white dark:bg-slate-900 flex items-center justify-between px-6 shadow-sm">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(!sidebarOpen)}>
              <FontAwesomeIcon icon={faBars} className="h-5 w-5" />
            </Button>
            {layoutLoading ? (
              <Skeleton className="h-6 w-32 bg-slate-200 dark:bg-slate-800" />
            ) : (
              <h1 className="text-xl font-bold">{getPageTitle()}</h1>
            )}
          </div>

          <div className="flex items-center gap-3">
            <ModeToggle />
            {layoutLoading ? (
              <Skeleton className="h-9 w-9 rounded-full bg-slate-200 dark:bg-slate-800" />
            ) : (
              <img 
                src={getAvatarUrl(user?.displayName)}
                alt={user?.displayName}
                className="h-9 w-9 rounded-full object-cover ring-2 ring-slate-200 dark:ring-slate-700"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://avatar.iran.liara.run/public';
                }}
              />
            )}
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-auto p-6 bg-slate-50 dark:bg-slate-950">
          <Outlet />
        </main>
      </div>

      {/* Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Logout Confirmation Dialog */}
      <AlertDialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
        <AlertDialogContent className="max-w-md">
          <AlertDialogHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="h-12 w-12 rounded-full bg-linear-to-r from-studyo-blue to-studyo-purple flex items-center justify-center">
                <FontAwesomeIcon icon={faTriangleExclamation} className="h-6 w-6 text-white" />
              </div>
              <div>
                <AlertDialogTitle className="text-xl">Konfirmasi Logout</AlertDialogTitle>
              </div>
            </div>
            <AlertDialogDescription className="text-base text-slate-600 dark:text-slate-400">
              Apakah Anda yakin ingin keluar dari dashboard? Anda perlu login kembali untuk mengakses sistem.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2 sm:gap-2">
            <AlertDialogCancel 
              className="m-0"
              disabled={isLoggingOut}
            >
              Batal
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleLogoutConfirm}
              disabled={isLoggingOut}
              className="bg-linear-to-r from-studyo-blue to-studyo-purple hover:from-[#2a9bd9] hover:to-[#9230d4] text-white m-0"
            >
              {isLoggingOut ? (
                <>
                  <FontAwesomeIcon icon={faSpinner} className="mr-2 h-4 w-4 animate-spin" />
                  Memproses...
                </>
              ) : (
                <>
                  <FontAwesomeIcon icon={faRightFromBracket} className="mr-2 h-4 w-4" />
                  Ya, Logout
                </>
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Layout;