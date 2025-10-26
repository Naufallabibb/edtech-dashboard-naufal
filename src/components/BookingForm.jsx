import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Alert, AlertDescription } from './ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUsers } from '@fortawesome/free-solid-svg-icons';

const BookingForm = ({ 
  isOpen, onClose, formData, setFormData, errors, setErrors, 
  onSubmit, loading, editingBooking, activeTutors, onTutorChange 
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            {editingBooking ? 'Edit Booking' : 'Tambah Booking Baru'}
          </DialogTitle>
          <DialogDescription>
            {editingBooking ? 'Perbarui informasi booking' : 'Isi form di bawah untuk menambahkan booking baru'}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="tutorId">
              Pilih Tutor <span className="text-red-500">*</span>
            </Label>
            <Select value={formData.tutorId} onValueChange={onTutorChange}>
              <SelectTrigger className={`w-full ${errors.tutorId ? 'border-red-500' : ''}`}>
                <SelectValue placeholder="-- Pilih Tutor --" />
              </SelectTrigger>
              <SelectContent>
                {activeTutors.map((tutor) => (
                  <SelectItem key={tutor.id} value={tutor.id}>
                    {tutor.name} - {tutor.subject} (Rp {tutor.hourlyRate?.toLocaleString('id-ID')}/jam)
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.tutorId && <p className="text-sm text-red-500">{errors.tutorId}</p>}
            {activeTutors.length === 0 && (
              <Alert className="border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/20">
                <FontAwesomeIcon icon={faUsers} className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                <AlertDescription className="text-amber-800 dark:text-amber-200 text-sm">
                  Belum ada tutor aktif. Silakan tambahkan tutor terlebih dahulu.
                </AlertDescription>
              </Alert>
            )}
          </div>

          {formData.tutorId && (
            <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
              <p className="text-sm font-semibold text-blue-900 dark:text-blue-100 mb-2">Informasi Tutor</p>
              <div className="space-y-1 text-sm text-blue-800 dark:text-blue-200">
                <p><span className="font-medium">Nama:</span> {formData.tutorName}</p>
                <p><span className="font-medium">Email:</span> {formData.tutorEmail}</p>
                <p><span className="font-medium">Subjek:</span> {formData.tutorSubject}</p>
              </div>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="studentName">
              Nama Siswa <span className="text-red-500">*</span>
            </Label>
            <Input
              id="studentName"
              value={formData.studentName}
              onChange={(e) => {
                setFormData({ ...formData, studentName: e.target.value });
                if (errors.studentName) setErrors({ ...errors, studentName: '' });
              }}
              className={errors.studentName ? 'border-red-500' : ''}
              placeholder="Contoh: Budi Santoso"
            />
            {errors.studentName && <p className="text-sm text-red-500">{errors.studentName}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date">
                Tanggal <span className="text-red-500">*</span>
              </Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => {
                  setFormData({ ...formData, date: e.target.value });
                  if (errors.date) setErrors({ ...errors, date: '' });
                }}
                className={errors.date ? 'border-red-500' : ''}
                min={new Date().toISOString().split('T')[0]}
              />
              {errors.date && <p className="text-sm text-red-500">{errors.date}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">
                Status <span className="text-red-500">*</span>
              </Label>
              <Select
                value={formData.status}
                onValueChange={(value) => setFormData({ ...formData, status: value })}
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="scheduled">Terjadwal</SelectItem>
                  <SelectItem value="completed">Selesai</SelectItem>
                  <SelectItem value="cancelled">Dibatalkan</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startTime">
                Jam Mulai <span className="text-red-500">*</span>
              </Label>
              <Input
                id="startTime"
                type="time"
                value={formData.startTime}
                onChange={(e) => {
                  setFormData({ ...formData, startTime: e.target.value });
                  if (errors.startTime) setErrors({ ...errors, startTime: '' });
                }}
                className={errors.startTime ? 'border-red-500' : ''}
              />
              {errors.startTime && <p className="text-sm text-red-500">{errors.startTime}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="endTime">
                Jam Selesai <span className="text-red-500">*</span>
              </Label>
              <Input
                id="endTime"
                type="time"
                value={formData.endTime}
                onChange={(e) => {
                  setFormData({ ...formData, endTime: e.target.value });
                  if (errors.endTime) setErrors({ ...errors, endTime: '' });
                }}
                className={errors.endTime ? 'border-red-500' : ''}
              />
              {errors.endTime && <p className="text-sm text-red-500">{errors.endTime}</p>}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Batal</Button>
          <Button 
            onClick={onSubmit} 
            disabled={loading || activeTutors.length === 0}
            className="bg-linear-to-r from-studyo-blue to-studyo-purple hover:from-[#2a9bd9] hover:to-[#9230d4]"
          >
            {editingBooking ? 'Perbarui' : 'Tambah'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default BookingForm;