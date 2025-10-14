export const PeriodNaming = (name) => {
  if (name) {
    let f_name;
    switch (name) {
      case 'Monthly':
        f_name = 'Month';
        break;

      case 'Annually':
        f_name = 'Annum';
        break;

      case 'Quarterly':
        f_name = 'Quarter';
        break;

      case 'Weekly':
        f_name = 'Week';
        break;

      case 'Bi-weekly':
        f_name = 'Bi-weekly';
        break;

      case 'Daily':
        f_name = 'Day';
        break;
      case 'Period':
        f_name = 'Period';
        break;

      default:
        f_name = 'Quarter';
        break;
    }
    return f_name;
  }
};

export const formatDate = (createdAt) => {
  const date = new Date(createdAt);

  // Get the month name
  const monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];
  const month = monthNames[date.getMonth()];

  // Get the day and pad it with leading zeros if necessary
  const day = String(date.getDate()).padStart(2, '0');

  // Get the year
  const year = date.getFullYear();

  // Format the date as DDMMYYYY
  const formattedDate = `${month.slice(0, 3)}, ${day}/${year}`;

  return {
    monthName: month.slice(0, 3),
    formattedDate: formattedDate,
  };
};

export const formattedDate = (dateString) => {
  if (dateString) {
    const [datePart] = dateString.split(' ');

    const [year, month, day] = datePart.split('-');

    return `${day}/${month}/${year}`;
  } else {
    return dateString;
  }
};

export const MeasuringUnitConverter = (mu) => {
  let MeasuredBy = '';

  switch (mu) {
    case 'Percentage':
      MeasuredBy = '%';
      break;

    case 'Money':
      MeasuredBy = 'ETB';
      break;

    case 'Time':
      MeasuredBy = 'Hour';
      break;

    default:
      MeasuredBy = '';
  }
  return MeasuredBy;
};

export const getStatusColor = (status) => {
  // Handle null/undefined/empty cases
  if (!status) return 'gray';

  // Convert to string in case it's a number or other type
  const statusStr = String(status).toLowerCase();

  const greenStatuses = ['approved', 'done', 'accepted', 'active', 'completed'];
  const blueStatuses = [
    'in-progress',
    'open for discussion',
    'in progress',
    'in_progress',
  ];
  const purpleStatuses = ['escalated', 'blocked'];
  const orangeStatuses = ['pending', 'draft'];
  const redStatuses = ['rejected', 'cancelled'];

  if (greenStatuses.includes(statusStr)) return '#4CAF50'; // Green
  if (blueStatuses.includes(statusStr)) return '#2196F3'; // Blue
  if (purpleStatuses.includes(statusStr)) return '#9C27B0'; // Purple
  if (orangeStatuses.includes(statusStr)) return '#FF9800'; // Orange
  if (redStatuses.includes(statusStr)) return '#F44336'; // Red

  return '#9E9E9E'; // Gray (default)
};

export const taskStatusColor = (status) => {
  switch (status.toLowerCase()) {
    case 'done':
      return 'green';
    case 'pending':
      return '#FFA500';
    case 'cancelled':
      return 'red';
    case 'inprogress':
      return 'blue';
    case 'blocked':
      return 'purple';
    default:
      return 'gray';
  }
};

export const getTodayName = () => {
  const days = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ];
  const todayDayName = days[new Date().getDay()];

  return todayDayName;
};

export function a11yProps(index) {
  return {
    id: `full-width-tab-${index}`,
    'aria-controls': `full-width-tabpanel-${index}`,
  };
}
