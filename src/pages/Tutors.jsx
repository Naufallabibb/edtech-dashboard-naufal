import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTutors, addTutor, editTutor, removeTutor } from '../store/slices/tutorsSlice';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { Skeleton } from '../components/ui/skeleton';
import { toast } from 'sonner';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faSearch, faUsers } from '@fortawesome/free-solid-svg-icons';
import TutorCard from '../components/TutorCard';
import TutorForm from '../components/TutorForm';
import Pagination from '../components/Pagination';

const Tutors = () => {
  const dispatch = useDispatch();
  const { tutors, loading, initialLoading } = useSelector((state) => state.tutors);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingTutor, setEditingTutor] = useState(null);
  const [deletingTutorId, setDeletingTutorId] = useState(null);
  const [formData, setFormData] = useState({
    name: '', email: '', subject: '', hourlyRate: '', status: 'active'
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    dispatch(fetchTutors());
  }, [dispatch]);

  const filteredTutors = tutors.filter((tutor) => {
    const matchesSearch = 
      tutor.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tutor.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tutor.subject?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || tutor.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filteredTutors.length / itemsPerPage);
  const paginatedTutors = filteredTutors.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Nama wajib diisi';
    if (!formData.email.trim()) {
      newErrors.email = 'Email wajib diisi';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Format email tidak valid';
    }
    if (!formData.subject) newErrors.subject = 'Subjek wajib diisi';
    if (!formData.hourlyRate || formData.hourlyRate <= 0) {
      newErrors.hourlyRate = 'Tarif harus lebih dari 0';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleOpenDialog = (tutor = null) => {
    if (tutor) {
      setEditingTutor(tutor);
      setFormData({
        name: tutor.name, email: tutor.email, subject: tutor.subject,
        hourlyRate: tutor.hourlyRate, status: tutor.status
      });
    } else {
      setEditingTutor(null);
      setFormData({ name: '', email: '', subject: '', hourlyRate: '', status: 'active' });
    }
    setErrors({});
    setIsDialogOpen(true);
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    try {
      if (editingTutor) {
        await dispatch(editTutor({
          id: editingTutor.id,
          tutorData: { ...formData, hourlyRate: Number(formData.hourlyRate) }
        })).unwrap();
        toast.success('Tutor berhasil diperbarui');
      } else {
        await dispatch(addTutor({ ...formData, hourlyRate: Number(formData.hourlyRate) })).unwrap();
        toast.success('Tutor berhasil ditambahkan');
      }
      setIsDialogOpen(false);
    } catch (error) {
      toast.error('Gagal menyimpan tutor', { description: error });
    }
  };

  const handleDelete = async () => {
    try {
      const { checkTutorHasBookings } = await import('../services/firestoreHelpers');
      const hasBookings = await checkTutorHasBookings(deletingTutorId);
      if (hasBookings) {
        toast.error('Tidak dapat menghapus tutor', { 
          description: 'Tutor ini masih memiliki booking aktif. Hapus atau selesaikan booking terlebih dahulu.' 
        });
        setIsDeleteDialogOpen(false);
        setDeletingTutorId(null);
        return;
      }
      await dispatch(removeTutor(deletingTutorId)).unwrap();
      toast.success('Tutor berhasil dihapus');
      setIsDeleteDialogOpen(false);
      setDeletingTutorId(null);
    } catch (error) {
      toast.error('Gagal menghapus tutor', { description: error.message || error });
    }
  };

  const openDeleteDialog = (id) => {
    setDeletingTutorId(id);
    setIsDeleteDialogOpen(true);
  };

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
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <Skeleton className="h-10 flex-1" />
              <div className="flex gap-2">
                <Skeleton className="h-10 w-24" />
                <Skeleton className="h-10 w-24" />
                <Skeleton className="h-10 w-32" />
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="rounded-lg border border-slate-200 dark:border-slate-800 overflow-hidden">
                <div className="bg-slate-50 dark:bg-slate-900 p-4 grid grid-cols-6 gap-4">
                  <Skeleton className="h-4 col-span-2" />
                  <Skeleton className="h-4" />
                  <Skeleton className="h-4" />
                  <Skeleton className="h-4" />
                  <Skeleton className="h-4" />
                </div>
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="p-4 border-t border-slate-100 dark:border-slate-800 grid grid-cols-6 gap-4 items-center">
                    <div className="flex items-center gap-3 col-span-2">
                      <Skeleton className="h-10 w-10 rounded-full" />
                      <Skeleton className="h-4 w-32" />
                    </div>
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-6 w-20 rounded-full" />
                    <Skeleton className="h-4 w-24" />
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
              <CardTitle className="text-2xl font-bold text-slate-900 dark:text-slate-100">Manajemen Tutor</CardTitle>
              <CardDescription className="text-slate-600 dark:text-slate-400">
                Kelola data tutor dan informasi mereka
              </CardDescription>
            </div>
            <Button 
              onClick={() => handleOpenDialog()} 
              className="w-full md:w-auto bg-linear-to-r from-studyo-blue to-studyo-purple hover:from-[#2a9bd9] hover:to-[#9230d4]"
            >
              <FontAwesomeIcon icon={faPlus} className="mr-2 h-4 w-4" />
              Tambah Tutor
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <FontAwesomeIcon icon={faSearch} className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Cari berdasarkan nama, email, atau subjek..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 border-slate-200 dark:border-slate-700"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              <Button
                variant={statusFilter === 'all' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setStatusFilter('all')}
                className={statusFilter === 'all' ? 'bg-studyo-blue hover:bg-[#2a9bd9]' : ''}
              >
                Semua ({tutors.length})
              </Button>
              <Button
                variant={statusFilter === 'active' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setStatusFilter('active')}
                className={statusFilter === 'active' ? 'bg-green-500 hover:bg-green-600' : ''}
              >
                Aktif ({tutors.filter(t => t.status === 'active').length})
              </Button>
              <Button
                variant={statusFilter === 'inactive' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setStatusFilter('inactive')}
                className={statusFilter === 'inactive' ? 'bg-gray-500 hover:bg-gray-600' : ''}
              >
                Tidak Aktif ({tutors.filter(t => t.status === 'inactive').length})
              </Button>
            </div>
          </div>

          {filteredTutors.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <FontAwesomeIcon icon={faUsers} className="h-10 w-10 text-slate-400" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">
                {searchTerm || statusFilter !== 'all' ? 'Tidak ada hasil' : 'Belum ada tutor'}
              </h3>
              <p className="text-slate-600 dark:text-slate-400 mb-6">
                {searchTerm || statusFilter !== 'all' 
                  ? 'Tidak ada tutor yang sesuai dengan pencarian atau filter Anda' 
                  : 'Mulai dengan menambahkan tutor pertama Anda'}
              </p>
              {!searchTerm && statusFilter === 'all' && (
                <Button 
                  onClick={() => handleOpenDialog()}
                  className="bg-linear-to-r from-studyo-blue to-studyo-purple hover:from-[#2a9bd9] hover:to-[#9230d4]"
                >
                  <FontAwesomeIcon icon={faPlus} className="mr-2 h-4 w-4" />
                  Tambah Tutor Pertama
                </Button>
              )}
            </div>
          ) : (
            <>
              <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-800">
                <table className="w-full">
                  <thead className="bg-slate-50 dark:bg-slate-900">
                    <tr>
                      <th className="text-left py-4 px-6 font-semibold text-sm text-slate-700 dark:text-slate-300">Nama</th>
                      <th className="text-left py-4 px-6 font-semibold text-sm text-slate-700 dark:text-slate-300">Email</th>
                      <th className="text-left py-4 px-6 font-semibold text-sm text-slate-700 dark:text-slate-300">Subjek</th>
                      <th className="text-left py-4 px-6 font-semibold text-sm text-slate-700 dark:text-slate-300">Tarif/Jam</th>
                      <th className="text-left py-4 px-6 font-semibold text-sm text-slate-700 dark:text-slate-300">Status</th>
                      <th className="text-center py-4 px-6 font-semibold text-sm text-slate-700 dark:text-slate-300">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {paginatedTutors.map((tutor) => (
                      <TutorCard
                        key={tutor.id}
                        tutor={tutor}
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
                totalItems={filteredTutors.length}
              />
            </>
          )}
        </CardContent>
      </Card>

      <TutorForm
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        formData={formData}
        setFormData={setFormData}
        errors={errors}
        setErrors={setErrors}
        onSubmit={handleSubmit}
        loading={loading}
        editingTutor={editingTutor}
      />

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">Konfirmasi Hapus</DialogTitle>
            <DialogDescription>
              Apakah Anda yakin ingin menghapus tutor ini? Tindakan ini tidak dapat dibatalkan.
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

export default Tutors;