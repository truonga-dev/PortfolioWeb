import { motion } from 'framer-motion';

export const Skeleton = ({ className = '' }) => (
  <div className={`animate-pulse bg-gradient-to-r from-white/5 via-white/10 to-white/5 rounded-lg ${className}`} />
);

export const ProjectCardSkeleton = () => (
  <div className="bg-dark-800 border border-white/10 rounded-2xl p-6 space-y-4">
    <Skeleton className="h-6 w-3/4" />
    <Skeleton className="h-4 w-full" />
    <Skeleton className="h-4 w-2/3" />
    <div className="flex gap-2 pt-4">
      <Skeleton className="h-8 w-16 rounded-full" />
      <Skeleton className="h-8 w-16 rounded-full" />
      <Skeleton className="h-8 w-16 rounded-full" />
    </div>
  </div>
);

export const BlogCardSkeleton = () => (
  <div className="bg-dark-800 border border-white/10 rounded-2xl overflow-hidden">
    <Skeleton className="h-48 w-full rounded-none" />
    <div className="p-6 space-y-3">
      <Skeleton className="h-4 w-24" />
      <Skeleton className="h-6 w-full" />
      <Skeleton className="h-4 w-3/4" />
    </div>
  </div>
);

export const TableRowSkeleton = () => (
  <div className="flex gap-4 p-4 bg-dark-800 border border-white/10 rounded-xl">
    <Skeleton className="h-10 w-10 rounded-full" />
    <div className="flex-1 space-y-2">
      <Skeleton className="h-4 w-1/3" />
      <Skeleton className="h-3 w-2/3" />
    </div>
  </div>
);

export const HeroSkeleton = () => (
  <div className="min-h-screen flex items-center">
    <div className="max-w-7xl mx-auto px-4 w-full">
      <div className="grid lg:grid-cols-2 gap-12">
        <div className="space-y-6">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-16 w-3/4" />
          <Skeleton className="h-8 w-1/2" />
          <Skeleton className="h-20 w-full" />
          <div className="flex gap-4">
            <Skeleton className="h-12 w-40 rounded-xl" />
            <Skeleton className="h-12 w-40 rounded-xl" />
          </div>
        </div>
        <div className="flex justify-center">
          <Skeleton className="h-80 w-80 rounded-full" />
        </div>
      </div>
    </div>
  </div>
);

export default Skeleton;