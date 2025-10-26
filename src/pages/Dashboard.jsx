import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchTutors } from '../store/slices/tutorsSlice';
import { fetchBookings, fetchUpcomingBookings, fetchWeeklyBookingsData } from '../store/slices/bookingsSlice';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Skeleton } from '../components/ui/skeleton';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUsers, faCalendar, faClock, faChartLine } from '@fortawesome/free-solid-svg-icons';
import { Area, AreaChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';
import Pagination from '../components/Pagination';

const getAvatarUrl = (name) => {
  const username = name?.replace(/\s+/g, '+') || 'User';
  return `https://avatar.iran.liara.run/public?username=${username}`;
};

const StatCard = ({ title, value, icon, description, gradient }) => {
  return (
    <Card className="border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">{title}</CardTitle>
        <div className={`p-3 rounded-xl ${gradient} shadow-md`}>
          <FontAwesomeIcon icon={icon} className="h-5 w-5 text-white" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold text-slate-900 dark:text-slate-100">{value}</div>
        {description && <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{description}</p>}
      </CardContent>
    </Card>
  );
};

const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { tutors, initialLoading: tutorsInitialLoading } = useSelector((state) => state.tutors);
  const { bookings, upcomingBookings, weeklyData, initialLoading: bookingsInitialLoading } = useSelector((state) => state.bookings);

  const [upcomingPage, setUpcomingPage] = useState(1);
  const [tutorPage, setTutorPage] = useState(1);
  const [upcomingItemsPerPage, setUpcomingItemsPerPage] = useState(5);
  const [tutorItemsPerPage, setTutorItemsPerPage] = useState(5);

  useEffect(() => {
    dispatch(fetchTutors());
    dispatch(fetchBookings());
    dispatch(fetchUpcomingBookings());
    dispatch(fetchWeeklyBookingsData());
  }, [dispatch]);

  const totalTutors = tutors.length;
  const activeTutors = tutors.filter(t => t.status === 'active').length;
  const totalBookings = bookings.length;
  const upcomingCount = upcomingBookings.length;
  const completedBookings = bookings.filter(b => b.status === 'completed').length;

  // Calculate total bookings this week from weeklyData (real data from Firebase)
  const calculateWeeklyTotal = () => {
    if (!weeklyData || weeklyData.length === 0) return 0;
    return weeklyData.reduce((sum, day) => sum + day.bookings, 0);
  };

  // Calculate real growth percentage (current week vs previous week)
  const calculateGrowth = () => {
    if (bookings.length === 0) {
      return { percentage: '0', isPositive: true };
    }
    
    const today = new Date();
    today.setHours(23, 59, 59, 999);
    
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(today.getDate() - 6);
    sevenDaysAgo.setHours(0, 0, 0, 0);
    
    const fourteenDaysAgo = new Date();
    fourteenDaysAgo.setDate(today.getDate() - 13);
    fourteenDaysAgo.setHours(0, 0, 0, 0);
    
    const currentWeekStart = sevenDaysAgo.toISOString().split('T')[0];
    const currentWeekEnd = today.toISOString().split('T')[0];
    const previousWeekStart = fourteenDaysAgo.toISOString().split('T')[0];
    const previousWeekEnd = new Date(sevenDaysAgo.getTime() - 86400000).toISOString().split('T')[0];
    
    const currentWeekBookings = bookings.filter(b => {
      if (!b.date) return false;
      const bookingDate = b.date.split('T')[0];
      return bookingDate >= currentWeekStart && bookingDate <= currentWeekEnd;
    });
    
    const previousWeekBookings = bookings.filter(b => {
      if (!b.date) return false;
      const bookingDate = b.date.split('T')[0];
      return bookingDate >= previousWeekStart && bookingDate <= previousWeekEnd;
    });
    
    const currentCount = currentWeekBookings.length;
    const previousCount = previousWeekBookings.length;
    
    if (previousCount === 0) {
      const percentage = currentCount > 0 ? '+100' : '0';
      return { percentage, isPositive: currentCount >= 0 };
    }
    
    const growth = ((currentCount - previousCount) / previousCount) * 100;
    const percentage = growth > 0 ? `+${growth.toFixed(0)}` : growth.toFixed(0);
    
    return { percentage, isPositive: growth >= 0 };
  };

  const totalWeeklyBookings = calculateWeeklyTotal();
  const growthData = calculateGrowth();
  const growthPercentage = growthData.percentage;
  const isPositiveGrowth = growthData.isPositive;

  // Custom Tooltip Component
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 shadow-lg">
          <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{payload[0].payload.day}</p>
          <p className="text-xs text-blue-600 dark:text-blue-400">
            Bookings: <span className="font-bold">{payload[0].value}</span>
          </p>
        </div>
      );
    }
    return null;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  // Pagination for Upcoming Bookings
  const upcomingTotalPages = Math.ceil(upcomingBookings.length / upcomingItemsPerPage);
  const paginatedUpcoming = upcomingBookings.slice(
    (upcomingPage - 1) * upcomingItemsPerPage,
    upcomingPage * upcomingItemsPerPage
  );

  // Pagination for Tutors (already sorted by newest first from Redux)
  const tutorTotalPages = Math.ceil(tutors.length / tutorItemsPerPage);
  const paginatedTutors = tutors.slice(
    (tutorPage - 1) * tutorItemsPerPage,
    tutorPage * tutorItemsPerPage
  );

  // Enhanced Skeleton for Dashboard with Dark Mode Support
  if (tutorsInitialLoading || bookingsInitialLoading) {
    return (
      <div className="space-y-6">
        {/* Stats Cards Skeleton */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="border-slate-200 dark:border-slate-800 shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <Skeleton className="h-4 w-24 bg-slate-200 dark:bg-slate-800" />
                <Skeleton className="h-12 w-12 rounded-xl bg-slate-200 dark:bg-slate-800" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-9 w-16 mb-2 bg-slate-200 dark:bg-slate-800" />
                <Skeleton className="h-3 w-20 bg-slate-200 dark:bg-slate-800" />
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Chart and Upcoming Bookings Skeleton */}
        <div className="grid gap-6 lg:grid-cols-2">
          <Card className="border-slate-200 dark:border-slate-800 shadow-sm">
            <CardHeader className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
              <Skeleton className="h-6 w-40 mb-2 bg-slate-200 dark:bg-slate-800" />
              <Skeleton className="h-4 w-48 bg-slate-200 dark:bg-slate-800" />
            </CardHeader>
            <CardContent className="pt-6">
              <Skeleton className="h-[400px] w-full bg-slate-200 dark:bg-slate-800" />
              <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2">
                <Skeleton className="h-4 w-48 bg-slate-200 dark:bg-slate-800" />
                <Skeleton className="h-4 w-56 bg-slate-200 dark:bg-slate-800" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-200 dark:border-slate-800 shadow-sm">
            <CardHeader className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex flex-row items-center justify-between">
              <div className="space-y-2">
                <Skeleton className="h-6 w-36 bg-slate-200 dark:bg-slate-800" />
                <Skeleton className="h-4 w-24 bg-slate-200 dark:bg-slate-800" />
              </div>
              <Skeleton className="h-9 w-24 bg-slate-200 dark:bg-slate-800" />
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-3">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="flex items-center justify-between p-4 rounded-xl border border-slate-200 dark:border-slate-800">
                    <div className="flex items-center gap-3 flex-1">
                      <Skeleton className="h-10 w-10 rounded-full bg-slate-200 dark:bg-slate-800" />
                      <div className="space-y-2 flex-1">
                        <Skeleton className="h-4 w-32 bg-slate-200 dark:bg-slate-800" />
                        <Skeleton className="h-3 w-40 bg-slate-200 dark:bg-slate-800" />
                        <Skeleton className="h-3 w-24 bg-slate-200 dark:bg-slate-800" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Skeleton className="h-3 w-20 bg-slate-200 dark:bg-slate-800" />
                      <Skeleton className="h-3 w-24 bg-slate-200 dark:bg-slate-800" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tutors List Skeleton */}
        <Card className="border-slate-200 dark:border-slate-800 shadow-sm">
          <CardHeader className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex flex-row items-center justify-between">
            <Skeleton className="h-6 w-32 bg-slate-200 dark:bg-slate-800" />
            <Skeleton className="h-9 w-24 bg-slate-200 dark:bg-slate-800" />
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex items-center justify-between p-4 rounded-xl border border-slate-200 dark:border-slate-800">
                  <div className="flex items-center gap-3">
                    <Skeleton className="h-12 w-12 rounded-full bg-slate-200 dark:bg-slate-800" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-32 bg-slate-200 dark:bg-slate-800" />
                      <Skeleton className="h-3 w-24 bg-slate-200 dark:bg-slate-800" />
                    </div>
                  </div>
                  <div className="text-right space-y-2">
                    <Skeleton className="h-4 w-28 bg-slate-200 dark:bg-slate-800" />
                    <Skeleton className="h-5 w-16 rounded-full bg-slate-200 dark:bg-slate-800" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Tutors"
          value={totalTutors}
          icon={faUsers}
          description={`${activeTutors} aktif`}
          gradient="bg-gradient-to-br from-[#3babe9] to-[#2a9bd9]"
        />
        <StatCard
          title="Total Bookings"
          value={totalBookings}
          icon={faCalendar}
          description={`${completedBookings} selesai`}
          gradient="bg-gradient-to-br from-[#a240e4] to-[#9230d4]"
        />
        <StatCard
          title="Sesi Mendatang"
          value={upcomingCount}
          icon={faClock}
          description="3 hari ke depan"
          gradient="bg-gradient-to-br from-[#a854ab] to-[#973a9b]"
        />
        <StatCard
          title="Pertumbuhan"
          value={`${growthPercentage}%`}
          icon={faChartLine}
          description="vs minggu lalu"
          gradient={`bg-gradient-to-br ${isPositiveGrowth ? 'from-green-500 to-green-600' : 'from-red-500 to-red-600'}`}
        />
      </div>

      {/* Responsive Grid - Stack on mobile/tablet, side-by-side on desktop */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Booking Mingguan Card */}
        <Card className="border-slate-200 dark:border-slate-800 shadow-sm">
          <CardHeader className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 pb-3">
            <CardTitle className="text-lg sm:text-xl font-bold">Booking Mingguan</CardTitle>
            <CardDescription className="text-xs sm:text-sm">Grafik booking 7 hari terakhir</CardDescription>
          </CardHeader>
          <CardContent className="pt-3 pb-3 px-3 sm:px-6">
            {/* Chart Container - Pure Recharts without ChartContainer wrapper */}
            <div className="w-full h-[300px] sm:h-[350px] lg:h-[450px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={weeklyData}
                  margin={{ left: 0, right: 0, top: 10, bottom: 30 }}
                >
                  <defs>
                    <linearGradient id="fillBookings" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3babe9" stopOpacity={0.8} />
                      <stop offset="50%" stopColor="#a240e4" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#e8217b" stopOpacity={0.1} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid 
                    strokeDasharray="3 3" 
                    vertical={false} 
                    stroke="#e5e7eb" 
                    className="dark:stroke-slate-700"
                  />
                  <XAxis
                    dataKey="day"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    tick={{ fontSize: 11, fill: '#64748b' }}
                    className="dark:fill-slate-400"
                  />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    tick={{ fontSize: 11, fill: '#64748b' }}
                    width={30}
                    className="dark:fill-slate-400"
                  />
                  <Tooltip content={<CustomTooltip />} cursor={false} />
                  <Area
                    dataKey="bookings"
                    type="natural"
                    fill="url(#fillBookings)"
                    fillOpacity={0.6}
                    stroke="#3babe9"
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="flex w-full items-start gap-2 text-xs sm:text-sm mt-3 pt-3 border-t border-slate-100 dark:border-slate-800">
              <div className="grid gap-1">
                <div className="flex items-center gap-2 leading-tight font-medium text-slate-900 dark:text-slate-100">
                  Trending {isPositiveGrowth ? 'up' : 'down'} by {Math.abs(parseFloat(growthPercentage))}% minggu ini 
                  <FontAwesomeIcon 
                    icon={faChartLine} 
                    className={`h-4 w-4 ${isPositiveGrowth ? 'text-green-600 dark:text-green-500' : 'text-red-600 dark:text-red-500'}`} 
                  />
                </div>
                <div className="text-muted-foreground flex items-center gap-2 leading-tight dark:text-slate-400">
                  Total {totalWeeklyBookings} bookings minggu ini
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200 dark:border-slate-800 shadow-sm">
          <CardHeader className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <CardTitle className="text-lg sm:text-xl font-bold">Sesi Mendatang</CardTitle>
                <CardDescription className="text-xs sm:text-sm">3 hari ke depan</CardDescription>
              </div>
              
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => navigate('/bookings?range=next3d')}
                className="w-full sm:w-auto text-xs h-8"
              >
                Lihat Semua
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-3 sm:p-6">
            {upcomingBookings.length === 0 ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-3">
                  <FontAwesomeIcon icon={faClock} className="h-8 w-8 text-slate-400" />
                </div>
                <p className="text-slate-600 dark:text-slate-400 text-sm">Tidak ada sesi mendatang</p>
              </div>
            ) : (
              <>
                {/* Scrollable Container with responsive height */}
                <div className="space-y-3 max-h-[350px] sm:max-h-[400px] lg:max-h-[450px] overflow-y-auto pr-2 scroll-hidden">
                  {paginatedUpcoming.map((booking) => (
                    <div key={booking.id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-3 sm:p-4 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors">
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <img 
                          src={getAvatarUrl(booking.tutorName)}
                          alt={booking.tutorName}
                          className="w-10 h-10 rounded-full object-cover shrink-0 ring-2 ring-slate-200 dark:ring-slate-700"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = 'https://avatar.iran.liara.run/public';
                          }}
                        />
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-sm text-slate-900 dark:text-slate-100 truncate">{booking.tutorName}</p>
                          <p className="text-xs text-slate-500 dark:text-slate-400 truncate">Siswa: {booking.studentName}</p>
                          <p className="text-xs text-blue-600 dark:text-blue-400">{booking.tutorSubject}</p>
                        </div>
                      </div>
                      <div className="text-left sm:text-right shrink-0 sm:ml-2">
                        <p className="text-xs font-semibold text-slate-900 dark:text-slate-100">{formatDate(booking.date)}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">{booking.startTime} - {booking.endTime}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <Pagination
                  currentPage={upcomingPage}
                  totalPages={upcomingTotalPages}
                  onPageChange={setUpcomingPage}
                  itemsPerPage={upcomingItemsPerPage}
                  onItemsPerPageChange={(value) => {
                    setUpcomingItemsPerPage(value);
                    setUpcomingPage(1);
                  }}
                  totalItems={upcomingBookings.length}
                />
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Tutor Terbaru Card */}
      <Card className="border-slate-200 dark:border-slate-800 shadow-sm">
        <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
          <div>
            <CardTitle className="text-lg sm:text-xl font-bold">Tutor Terbaru</CardTitle>
          </div>
          <Button variant="outline" size="sm" onClick={() => navigate('/tutors')} className="w-full sm:w-auto">
            Lihat Semua
          </Button>
        </CardHeader>
        <CardContent className="p-3 sm:p-6">
          {tutors.length === 0 ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-3">
                <FontAwesomeIcon icon={faUsers} className="h-8 w-8 text-slate-400" />
              </div>
              <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">Belum ada tutor</p>
              <Button onClick={() => navigate('/tutors')} className="bg-linear-to-r from-studyo-blue to-studyo-purple hover:from-[#2a9bd9] hover:to-[#9230d4]">
                Tambah Tutor Pertama
              </Button>
            </div>
          ) : (
            <>
              {/* Scrollable Container with responsive height */}
              <div className="space-y-3 max-h-[400px] sm:max-h-[440px] overflow-y-auto pr-2 scroll-hidden">
                {paginatedTutors.map((tutor) => (
                  <div key={tutor.id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-3 sm:p-4 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors">
                    <div className="flex items-center gap-3">
                      <img 
                        src={getAvatarUrl(tutor.name)}
                        alt={tutor.name}
                        className="w-12 h-12 rounded-full object-cover shadow-md ring-2 ring-slate-200 dark:ring-slate-700"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = 'https://avatar.iran.liara.run/public';
                        }}
                      />
                      <div>
                        <p className="font-semibold text-sm text-slate-900 dark:text-slate-100">{tutor.name}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">{tutor.subject}</p>
                      </div>
                    </div>
                    <div className="text-left sm:text-right flex flex-row sm:flex-col justify-between sm:justify-start items-center sm:items-end gap-2">
                      <p className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-slate-100">Rp {tutor.hourlyRate?.toLocaleString('id-ID')}/jam</p>
                      <span className={`text-xs px-2 py-1 rounded-full font-semibold ${tutor.status === 'active' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400'}`}>
                        {tutor.status === 'active' ? 'Aktif' : 'Tidak Aktif'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              <Pagination
                currentPage={tutorPage}
                totalPages={tutorTotalPages}
                onPageChange={setTutorPage}
                itemsPerPage={tutorItemsPerPage}
                onItemsPerPageChange={(value) => {
                  setTutorItemsPerPage(value);
                  setTutorPage(1);
                }}
                totalItems={tutors.length}
              />
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;