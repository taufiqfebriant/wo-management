import { cn } from '@/lib/utils';
import { ImgHTMLAttributes } from 'react';

export default function AppLogoIcon({ className, ...props }: ImgHTMLAttributes<HTMLImageElement>) {
  return <img src="/logo.png" alt="TSP Logo" className={cn('size-6', className)} {...props} />;
}
