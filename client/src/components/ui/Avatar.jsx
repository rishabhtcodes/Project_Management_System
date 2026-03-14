import React from 'react';

const Avatar = ({ user, size = 'md', className = '' }) => {
  const sizes = {
    sm: 'h-6 w-6 text-xs',
    md: 'h-8 w-8 text-sm',
    lg: 'h-10 w-10 text-base',
    xl: 'h-12 w-12 text-lg',
  };

  const getInitials = (name) => {
    if (!name) return '?';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  if (user?.avatar) {
    return (
      <img
        src={user.avatar}
        alt={user.name || 'User avatar'}
        className={`rounded-full object-cover border-2 border-white ${sizes[size]} ${className}`}
        title={user.name}
      />
    );
  }

  return (
    <div
      className={`rounded-full flex items-center justify-center bg-primary-100 text-primary-700 font-semibold border-2 border-white ${sizes[size]} ${className}`}
      title={user?.name}
    >
      {getInitials(user?.name)}
    </div>
  );
};

export default Avatar;
