import { Loader2 } from 'lucide-react';

const Loader = ({ size = 'md', fullScreen = false, message = 'Loading...' }) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
    xl: 'h-16 w-16',
  };

  const content = (
    <div className="flex flex-col items-center justify-center space-y-4">
      <Loader2 className={`${sizeClasses[size]} animate-spin text-blue-500`} />
      {message && (
        <p className="text-gray-600 dark:text-gray-400 text-sm">{message}</p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-white dark:bg-gray-900 bg-opacity-80 dark:bg-opacity-80 backdrop-blur-sm z-50 flex items-center justify-center">
        {content}
      </div>
    );
  }

  return content;
};

export default Loader;

// Skeleton Loader for cards
export const SkeletonCard = () => (
  <div className="animate-pulse bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md">
    <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
    <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded w-1/2 mb-4"></div>
    <div className="space-y-2">
      <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded"></div>
      <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-5/6"></div>
    </div>
  </div>
);

// Skeleton Loader for list items
export const SkeletonListItem = () => (
  <div className="animate-pulse flex items-center space-x-4 p-4">
    <div className="h-12 w-12 bg-gray-300 dark:bg-gray-700 rounded-full"></div>
    <div className="flex-1 space-y-2">
      <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-3/4"></div>
      <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-1/2"></div>
    </div>
  </div>
);
