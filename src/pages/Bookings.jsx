import { useEffect, useState, useRef } from 'react'; // ✅ Tambah useRef
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import { fetchBookings, addBooking, editBooking, removeBooking } from '../store/slices/bookingsSlice';
import { fetchTutors } from '../store/slices/tutorsSlice';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { Skeleton } from '../components/ui/skeleton';
import { Alert, AlertDescription } from '../components/ui/alert';
import { toast } from 'sonner';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faCalendar, faCircleExclamation } from '@fortawesome/free-solid-svg-icons';
import BookingCard from '../components/BookingCard';
import BookingForm from '../components/BookingForm';
import Pagination from '../components/Pagination';

const Bookings = () => {
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const { bookings, loading, initialLoading } = useSelector((state) => state.bookings);
  const { tutors } = useSelector((state) => state.tutors);

  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingBooking, setEditingBooking] = useState(null);
  const [deletingBookingId, setDeletingBookingId] = useState(null);
  const [formData, setFormData] = useState({
    tutorId: '', tutorName: '', tutorEmail: '', tutorSubject: '',
    studentName: '', date: '', startTime: '', endTime: '', status: 'scheduled'
  });
  const [errors, setErrors] = useState({});

  // ✅ Ref untuk prevent double toast
  const toastShownRef = useRef(false);

  useEffect(() => {
    dispatch(fetchBookings());
    dispatch(fetchTutors());
  }, [dispatch]);

  // ✅ FIXED - Handle query parameter dari Dashboard (NO DOUBLE TOAST)
  useEffect(() => {
    const range = searchParams.get('range');
    
    if (range === 'next3d' && !toastShownRef.current) {
      // Auto-filter ke Scheduled (karena upcoming = scheduled)
      setStatusFilter('scheduled');
      
      // Tampilkan notifikasi (hanya sekali)
      toast.info('Filter Diterapkan', {
        description: 'Menampilkan booking terjadwal untuk 3 hari ke depan'
      });
      
      // Set flag bahwa toast sudah ditampilkan
      toastShownRef.current = true;
      
      // Bersihkan query parameter dari URL
      setSearchParams({});
    }
  }, [searchParams, setSearchParams]);

  const activeTutors = tutors.filter(t => t.status === 'active');
  const filteredBookings = bookings.filter((booking) => {
    return statusFilter === 'all' || booking.status === statusFilter;
  });

  const totalPages = Math.ceil(filteredBookings.length / itemsPerPage);
  const paginatedBookings = filteredBookings.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const validateForm = () => {
    const newErrors = {};
    if (!formData.tutorId) newErrors.tutorId = 'Tutor wajib dipilih';
    if (!formData.studentName.trim()) newErrors.studentName = 'Nama siswa wajib diisi';
    if (!formData.date) newErrors.date = 'Tanggal wajib diisi';
    if (!formData.startTime) newErrors.startTime = 'Jam mulai wajib diisi';
    if (!formData.endTime) newErrors.endTime = 'Jam selesai wajib diisi';
    if (formData.startTime && formData.endTime && formData.startTime >= formData.endTime) {
      newErrors.endTime = 'Jam selesai harus lebih besar dari jam mulai';
    }
    if (formData.date) {
      const selectedDate = new Date(formData.date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (selectedDate < today) {
        newErrors.date = 'Tanggal tidak boleh di masa lalu';
      }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleTutorChange = (tutorId) => {
    const selectedTutor = tutors.find(t => t.id === tutorId);
    if (selectedTutor) {
      setFormData({
        ...formData, tutorId: selectedTutor.id, tutorName: selectedTutor.name,
        tutorEmail: selectedTutor.email, tutorSubject: selectedTutor.subject
      });
    } else {
      setFormData({
        ...formData, tutorId: '', tutorName: '', tutorEmail: '', tutorSubject: ''
      });
    }
    if (errors.tutorId) setErrors({ ...errors, tutorId: '' });
  };

  const handleOpenDialog = (booking = null) => {
    if (booking) {
      setEditingBooking(booking);
      setFormData({
        tutorId: booking.tutorId, tutorName: booking.tutorName,
        tutorEmail: booking.tutorEmail, tutorSubject: booking.tutorSubject,
        studentName: booking.studentName, date: booking.date,
        startTime: booking.startTime, endTime: booking.endTime, status: booking.status
      });
    } else {
      setEditingBooking(null);
      setFormData({
        tutorId: '', tutorName: '', tutorEmail: '', tutorSubject: '',
        studentName: '', date: '', startTime: '', endTime: '', status: 'scheduled'
      });
    }
    setErrors({});
    setIsDialogOpen(true);
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    try {
      const bookingData = {
        tutorId: formData.tutorId, tutorName: formData.tutorName,
        tutorEmail: formData.tutorEmail, tutorSubject: formData.tutorSubject,
        studentName: formData.studentName, date: formData.date,
        startTime: formData.startTime, endTime: formData.endTime, status: formData.status
      };
      if (editingBooking) {
        await dispatch(editBooking({ id: editingBooking.id, bookingData })).unwrap();
        toast.success('Booking berhasil diperbarui');
      } else {
        await dispatch(addBooking(bookingData)).unwrap();
        toast.success('Booking berhasil ditambahkan');
      }
      setIsDialogOpen(false);
    } catch (error) {
      toast.error('Gagal menyimpan booking', { description: error });
    }
  };

  const handleDelete = async () => {
    try {
      await dispatch(removeBooking(deletingBookingId)).unwrap();
      toast.success('Booking berhasil dihapus');
      setIsDeleteDialogOpen(false);
      setDeletingBookingId(null);
    } catch (error) {
      toast.error('Gagal menghapus booking', { description: error });
    }
  };

  const openDeleteDialog = (id) => {
    setDeletingBookingId(id);
    setIsDeleteDialogOpen(true);
  };

  // Enhanced Skeleton
  if (initialLoading) {
    return (
      <div className="space-y-6">
        <Card className="border-slate-200 dark:border-slate-800 shadow-sm">
          <CardHeader className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="space-y-2">
                <Skeleton className="h-8 w-48" />
                <Skeleton className="h-4 w-64" />
              </div>
              <Skeleton className="h-10 w-full md:w-36" />
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="flex gap-2 mb-6">
              <Skeleton className="h-9 w-24" />
              <Skeleton className="h-9 w-28" />
              <Skeleton className="h-9 w-24" />
              <Skeleton className="h-9 w-28" />
            </div>
            
            <div className="space-y-4">
              <div className="rounded-lg border border-slate-200 dark:border-slate-800 overflow-hidden">
                <div className="bg-slate-50 dark:bg-slate-900 p-4 grid grid-cols-6 gap-4">
                  <Skeleton className="h-4" />
                  <Skeleton className="h-4" />
                  <Skeleton className="h-4" />
                  <Skeleton className="h-4" />
                  <Skeleton className="h-4" />
                  <Skeleton className="h-4" />
                </div>
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="p-4 border-t border-slate-100 dark:border-slate-800 grid grid-cols-6 gap-4 items-center">
                    <div className="flex items-center gap-3">
                      <Skeleton className="h-10 w-10 rounded-full" />
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-3 w-20" />
                      </div>
                    </div>
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-6 w-20 rounded-full" />
                    <div className="flex gap-2 justify-center">
                      <Skeleton className="h-8 w-8" />
                      <Skeleton className="h-8 w-8" />
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="flex justify-between items-center">
                <Skeleton className="h-4 w-48" />
                <div className="flex gap-2">
                  <Skeleton className="h-9 w-32" />
                  <Skeleton className="h-9 w-9" />
                  <Skeleton className="h-9 w-9" />
                  <Skeleton className="h-9 w-9" />
                  <Skeleton className="h-9 w-9" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="border-slate-200 dark:border-slate-800 shadow-sm">
        <CardHeader className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle className="text-2xl font-bold text-slate-900 dark:text-slate-100">Manajemen Booking</CardTitle>
              <CardDescription className="text-slate-600 dark:text-slate-400">
                Kelola jadwal sesi pembelajaran
              </CardDescription>
            </div>
            <Button 
              onClick={() => handleOpenDialog()} 
              className="w-full md:w-auto bg-linear-to-r from-studyo-blue to-studyo-purple hover:from-[#2a9bd9] hover:to-[#9230d4]"
              disabled={activeTutors.length === 0}
            >
              <FontAwesomeIcon icon={faPlus} className="mr-2 h-4 w-4" />
              Tambah Booking
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          {activeTutors.length === 0 && (
            <Alert className="mb-6 border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/20">
              <FontAwesomeIcon icon={faCircleExclamation} className="h-4 w-4 text-amber-600 dark:text-amber-400" />
              <AlertDescription className="text-amber-800 dark:text-amber-200">
                Belum ada tutor aktif. Silakan tambahkan tutor terlebih dahulu di halaman Tutors sebelum membuat booking.
              </AlertDescription>
            </Alert>
          )}

          <div className="flex gap-2 mb-6 flex-wrap">
            <Button
              variant={statusFilter === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setStatusFilter('all')}
              className={statusFilter === 'all' ? 'bg-studyo-blue hover:bg-[#2a9bd9]' : ''}
            >
              Semua ({bookings.length})
            </Button>
            <Button
              variant={statusFilter === 'scheduled' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setStatusFilter('scheduled')}
              className={statusFilter === 'scheduled' ? 'bg-blue-500 hover:bg-blue-600' : ''}
            >
              Terjadwal ({bookings.filter(b => b.status === 'scheduled').length})
            </Button>
            <Button
              variant={statusFilter === 'completed' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setStatusFilter('completed')}
              className={statusFilter === 'completed' ? 'bg-green-500 hover:bg-green-600' : ''}
            >
              Selesai ({bookings.filter(b => b.status === 'completed').length})
            </Button>
            <Button
              variant={statusFilter === 'cancelled' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setStatusFilter('cancelled')}
              className={statusFilter === 'cancelled' ? 'bg-red-500 hover:bg-red-600' : ''}
            >
              Dibatalkan ({bookings.filter(b => b.status === 'cancelled').length})
            </Button>
          </div>

          {filteredBookings.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <FontAwesomeIcon icon={faCalendar} className="h-10 w-10 text-slate-400" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">
                {statusFilter !== 'all' ? 'Tidak ada booking' : 'Belum ada booking'}
              </h3>
              <p className="text-slate-600 dark:text-slate-400 mb-6">
                {statusFilter !== 'all' 
                  ? 'Tidak ada booking dengan status ini' 
                  : activeTutors.length === 0
                  ? 'Tambahkan tutor terlebih dahulu untuk membuat booking'
                  : 'Mulai dengan menambahkan booking pertama Anda'}
              </p>
              {statusFilter === 'all' && activeTutors.length > 0 && (
                <Button 
                  onClick={() => handleOpenDialog()}
                  className="bg-linear-to-r from-studyo-blue to-studyo-purple hover:from-[#2a9bd9] hover:to-[#9230d4]"
                >
                  <FontAwesomeIcon icon={faPlus} className="mr-2 h-4 w-4" />
                  Tambah Booking Pertama
                </Button>
              )}
            </div>
          ) : (
            <>
              <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-800">
                <table className="w-full">
                  <thead className="bg-slate-50 dark:bg-slate-900">
                    <tr>
                      <th className="text-left py-4 px-6 font-semibold text-sm text-slate-700 dark:text-slate-300">Tutor</th>
                      <th className="text-left py-4 px-6 font-semibold text-sm text-slate-700 dark:text-slate-300">Siswa</th>
                      <th className="text-left py-4 px-6 font-semibold text-sm text-slate-700 dark:text-slate-300">Tanggal</th>
                      <th className="text-left py-4 px-6 font-semibold text-sm text-slate-700 dark:text-slate-300">Waktu</th>
                      <th className="text-left py-4 px-6 font-semibold text-sm text-slate-700 dark:text-slate-300">Status</th>
                      <th className="text-center py-4 px-6 font-semibold text-sm text-slate-700 dark:text-slate-300">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {paginatedBookings.map((booking) => (
                      <BookingCard
                        key={booking.id}
                        booking={booking}
                        onEdit={handleOpenDialog}
                        onDelete={openDeleteDialog}
                      />
                    ))}
                  </tbody>
                </table>
              </div>
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
                itemsPerPage={itemsPerPage}
                onItemsPerPageChange={(value) => {
                  setItemsPerPage(value);
                  setCurrentPage(1);
                }}
                totalItems={filteredBookings.length}
              />
            </>
          )}
        </CardContent>
      </Card>

      <BookingForm
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        formData={formData}
        setFormData={setFormData}
        errors={errors}
        setErrors={setErrors}
        onSubmit={handleSubmit}
        loading={loading}
        editingBooking={editingBooking}
        activeTutors={activeTutors}
        onTutorChange={handleTutorChange}
      />

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">Konfirmasi Hapus</DialogTitle>
            <DialogDescription>
              Apakah Anda yakin ingin menghapus booking ini? Tindakan ini tidak dapat dibatalkan.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>Batal</Button>
            <Button 
              variant="destructive" 
              onClick={handleDelete} 
              disabled={loading}
              className="bg-red-600 hover:bg-red-700"
            >
              Hapus
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Bookings;