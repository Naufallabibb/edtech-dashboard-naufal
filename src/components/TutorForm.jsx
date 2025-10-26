import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

const SUBJECTS = [
  'Matematika', 'Fisika', 'Kimia', 'Biologi', 'Bahasa Indonesia', 'Bahasa Inggris',
  'Bahasa Jepang', 'Bahasa Mandarin', 'Sejarah', 'Geografi', 'Ekonomi', 'Akuntansi',
  'Sosiologi', 'Antropologi', 'Seni Rupa', 'Musik', 'Olahraga', 'Komputer/TIK',
  'Pemrograman', 'Web Development', 'Data Science', 'Machine Learning', 'UI/UX Design', 'Digital Marketing'
];

const TutorForm = ({ isOpen, onClose, formData, setFormData, errors, setErrors, onSubmit, loading, editingTutor }) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            {editingTutor ? 'Edit Tutor' : 'Tambah Tutor Baru'}
          </DialogTitle>
          <DialogDescription>
            {editingTutor ? 'Perbarui informasi tutor' : 'Isi form di bawah untuk menambahkan tutor baru'}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">
              Nama Lengkap <span className="text-red-500">*</span>
            </Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => {
                setFormData({ ...formData, name: e.target.value });
                if (errors.name) setErrors({ ...errors, name: '' });
              }}
              className={errors.name ? 'border-red-500' : ''}
              placeholder="Contoh: John Doe"
            />
            {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">
              Email <span className="text-red-500">*</span>
            </Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => {
                setFormData({ ...formData, email: e.target.value });
                if (errors.email) setErrors({ ...errors, email: '' });
              }}
              className={errors.email ? 'border-red-500' : ''}
              placeholder="john@example.com"
            />
            {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="subject">
              Subjek <span className="text-red-500">*</span>
            </Label>
            <Select
              value={formData.subject}
              onValueChange={(value) => {
                setFormData({ ...formData, subject: value });
                if (errors.subject) setErrors({ ...errors, subject: '' });
              }}
            >
              <SelectTrigger className={`w-full ${errors.subject ? 'border-red-500' : ''}`}>
                <SelectValue placeholder="Pilih subjek" />
              </SelectTrigger>
              <SelectContent className="max-h-60">
                {SUBJECTS.map((subject) => (
                  <SelectItem key={subject} value={subject}>{subject}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.subject && <p className="text-sm text-red-500">{errors.subject}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="hourlyRate">
              Tarif per Jam (Rp) <span className="text-red-500">*</span>
            </Label>
            <Input
              id="hourlyRate"
              type="number"
              value={formData.hourlyRate}
              onChange={(e) => {
                setFormData({ ...formData, hourlyRate: e.target.value });
                if (errors.hourlyRate) setErrors({ ...errors, hourlyRate: '' });
              }}
              placeholder="50000"
              className={errors.hourlyRate ? 'border-red-500' : ''}
            />
            {errors.hourlyRate && <p className="text-sm text-red-500">{errors.hourlyRate}</p>}
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
                <SelectItem value="active">Aktif</SelectItem>
                <SelectItem value="inactive">Tidak Aktif</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Batal</Button>
          <Button 
            onClick={onSubmit} 
            disabled={loading}
            className="bg-linear-to-r from-studyo-blue to-studyo-purple hover:from-[#2a9bd9] hover:to-[#9230d4]"
          >
            {editingTutor ? 'Perbarui' : 'Tambah'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TutorForm;