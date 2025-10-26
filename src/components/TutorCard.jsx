import { Button } from './ui/button';
import { Checkbox } from './ui/checkbox';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencil, faTrash } from '@fortawesome/free-solid-svg-icons';

const getAvatarUrl = (name) => {
  const username = name?.replace(/\s+/g, '+') || 'User';
  return `https://avatar.iran.liara.run/public?username=${username}`;
};

const TutorCard = ({ tutor, onEdit, onDelete, isSelected, onSelectChange }) => {
  return (
    <tr className="hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors">
      <td className="py-4 px-6">
        <Checkbox
          checked={isSelected}
          onCheckedChange={() => onSelectChange(tutor.id)}
          aria-label={`Select ${tutor.name}`}
        />
      </td>
      <td className="py-4 px-6">
        <div className="flex items-center gap-3">
          <img 
            src={getAvatarUrl(tutor.name)}
            alt={tutor.name}
            className="w-10 h-10 rounded-full object-cover shrink-0 ring-2 ring-slate-200 dark:ring-slate-700"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'https://avatar.iran.liara.run/public';
            }}
          />
          <span className="font-medium text-slate-900 dark:text-slate-100">{tutor.name}</span>
        </div>
      </td>
      <td className="py-4 px-6 text-slate-600 dark:text-slate-400">
        <div className="max-w-[200px] truncate" title={tutor.email}>
          {tutor.email}
        </div>
      </td>
      <td className="py-4 px-6">
        <div className="inline-flex items-center">
          <span 
            className="px-3 py-1.5 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-full text-sm font-medium max-w-40 truncate block" 
            title={tutor.subject}
          >
            {tutor.subject}
          </span>
        </div>
      </td>
      <td className="py-4 px-6 font-semibold text-slate-900 dark:text-slate-100 whitespace-nowrap">
        Rp {tutor.hourlyRate?.toLocaleString('id-ID')}
      </td>
      <td className="py-4 px-6">
        <span
          className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap inline-block ${
            tutor.status === 'active'
              ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
              : 'bg-gray-100 dark:bg-gray-900/30 text-gray-700 dark:text-gray-400'
          }`}
        >
          {tutor.status === 'active' ? 'Aktif' : 'Tidak Aktif'}
        </span>
      </td>
      <td className="py-4 px-6">
        <div className="flex items-center justify-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit(tutor)}
            className="text-studyo-blue hover:text-[#2a9bd9] hover:bg-blue-50 dark:hover:bg-blue-900/30"
          >
            <FontAwesomeIcon icon={faPencil} className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(tutor.id)}
            className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/30"
          >
            <FontAwesomeIcon icon={faTrash} className="h-4 w-4" />
          </Button>
        </div>
      </td>
    </tr>
  );
};

export default TutorCard;