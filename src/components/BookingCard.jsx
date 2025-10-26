import { Button } from './ui/button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendar, faClock, faPencil, faTrash } from '@fortawesome/free-solid-svg-icons';

const getAvatarUrl = (name) => {
  const username = name?.replace(/\s+/g, '+') || 'User';
  return `https://avatar.iran.liara.run/public?username=${username}`;
};

const getStatusColor = (status) => {
  switch (status) {
    case 'scheduled':
      return 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400';
    case 'completed':
      return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400';
    case 'cancelled':
      return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400';
    default:
      return 'bg-gray-100 dark:bg-gray-900/30 text-gray-700 dark:text-gray-400';
  }
};

const getStatusLabel = (status) => {
  switch (status) {
    case 'scheduled': return 'Terjadwal';
    case 'completed': return 'Selesai';
    case 'cancelled': return 'Dibatalkan';
    default: return status;
  }
};

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
};

const BookingCard = ({ booking, onEdit, onDelete }) => {
  return (
    <tr className="hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors">
      <td className="py-4 px-6">
        <div className="flex items-center gap-3">
          <img 
            src={getAvatarUrl(booking.tutorName)}
            alt={booking.tutorName}
            className="w-10 h-10 rounded-full object-cover shrink-0 ring-2 ring-slate-200 dark:ring-slate-700"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'https://avatar.iran.liara.run/public';
            }}
          />
          <div>
            <p className="font-semibold text-slate-900 dark:text-slate-100">{booking.tutorName}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">{booking.tutorSubject}</p>
          </div>
        </div>
      </td>
      <td className="py-4 px-6 font-medium text-slate-700 dark:text-slate-300">{booking.studentName}</td>
      <td className="py-4 px-6">
        <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
          <FontAwesomeIcon icon={faCalendar} className="h-4 w-4 text-slate-400" />
          {formatDate(booking.date)}
        </div>
      </td>
      <td className="py-4 px-6">
        <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
          <FontAwesomeIcon icon={faClock} className="h-4 w-4 text-slate-400" />
          {booking.startTime} - {booking.endTime}
        </div>
      </td>
      <td className="py-4 px-6">
        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(booking.status)}`}>
          {getStatusLabel(booking.status)}
        </span>
      </td>
      <td className="py-4 px-6">
        <div className="flex items-center justify-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit(booking)}
            className="text-studyo-blue hover:text-[#2a9bd9] hover:bg-blue-50 dark:hover:bg-blue-900/30"
          >
            <FontAwesomeIcon icon={faPencil} className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(booking.id)}
            className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/30"
          >
            <FontAwesomeIcon icon={faTrash} className="h-4 w-4" />
          </Button>
        </div>
      </td>
    </tr>
  );
};

export default BookingCard;