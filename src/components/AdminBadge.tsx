
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Shield, Crown } from 'lucide-react';
import type { Profile } from '@/lib/types';

interface AdminBadgeProps {
  role: Profile['role'];
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
}

const AdminBadge: React.FC<AdminBadgeProps> = ({ 
  role, 
  size = 'sm', 
  showIcon = true 
}) => {
  if (role === 'staff') {
    return null; // Don't show badge for regular staff
  }

  const getVariant = () => {
    switch (role) {
      case 'super_admin':
        return 'destructive';
      case 'content_admin':
        return 'default';
      default:
        return 'secondary';
    }
  };

  const getIcon = () => {
    switch (role) {
      case 'super_admin':
        return <Crown className="w-3 h-3" />;
      case 'content_admin':
        return <Shield className="w-3 h-3" />;
      default:
        return <Shield className="w-3 h-3" />;
    }
  };

  const getText = () => {
    switch (role) {
      case 'super_admin':
        return 'Super Admin';
      case 'content_admin':
        return 'Admin';
      default:
        return 'Admin';
    }
  };

  const sizeClasses = {
    sm: 'text-xs px-1.5 py-0.5',
    md: 'text-sm px-2 py-1',
    lg: 'text-base px-3 py-1.5'
  };

  return (
    <Badge 
      variant={getVariant()} 
      className={`flex items-center gap-1 w-fit ${sizeClasses[size]}`}
    >
      {showIcon && getIcon()}
      {getText()}
    </Badge>
  );
};

export default AdminBadge;
