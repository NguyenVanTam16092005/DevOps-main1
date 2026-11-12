import React from 'react';

const Badge = ({ type, text }) => {
  const isMale = type === 'Nam';
  const isFemale = type === 'Nữ';

  let styles = 'bg-gray-100 text-gray-800';
  if (isMale) styles = 'bg-[#E3F2FD] text-[#1976D2]';
  if (isFemale) styles = 'bg-[#FCE4EC] text-[#D81B60]';

  return <span className={`px-3 py-1 text-xs font-semibold rounded-md ${styles}`}>{text || type}</span>;
};

export default Badge;