/**
 * Form Skeleton Component
 * Shows loading skeleton for form fields
 */

export default function FormSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* First row - 2 fields */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <div className="h-4 w-16 bg-gray-200 rounded dark:bg-gray-700 mb-2"></div>
          <div className="h-10 w-full bg-gray-200 rounded-lg dark:bg-gray-700"></div>
        </div>
        <div>
          <div className="h-4 w-16 bg-gray-200 rounded dark:bg-gray-700 mb-2"></div>
          <div className="h-10 w-full bg-gray-200 rounded-lg dark:bg-gray-700"></div>
        </div>
      </div>

      {/* Second row - 2 fields */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <div className="h-4 w-20 bg-gray-200 rounded dark:bg-gray-700 mb-2"></div>
          <div className="h-10 w-full bg-gray-200 rounded-lg dark:bg-gray-700"></div>
        </div>
        <div>
          <div className="h-4 w-24 bg-gray-200 rounded dark:bg-gray-700 mb-2"></div>
          <div className="h-10 w-full bg-gray-200 rounded-lg dark:bg-gray-700"></div>
        </div>
      </div>

      {/* Third row - 2 fields (selects) */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <div className="h-4 w-16 bg-gray-200 rounded dark:bg-gray-700 mb-2"></div>
          <div className="h-10 w-full bg-gray-200 rounded-lg dark:bg-gray-700"></div>
        </div>
        <div>
          <div className="h-4 w-16 bg-gray-200 rounded dark:bg-gray-700 mb-2"></div>
          <div className="h-10 w-full bg-gray-200 rounded-lg dark:bg-gray-700"></div>
        </div>
      </div>

      {/* Optional password field */}
      <div>
        <div className="h-4 w-32 bg-gray-200 rounded dark:bg-gray-700 mb-2"></div>
        <div className="h-10 w-full bg-gray-200 rounded-lg dark:bg-gray-700"></div>
      </div>

      {/* Buttons */}
      <div className="flex items-center gap-4 pt-2">
        <div className="h-10 w-24 bg-gray-200 rounded-lg dark:bg-gray-700"></div>
        <div className="h-10 w-24 bg-gray-200 rounded-lg dark:bg-gray-700"></div>
      </div>
    </div>
  );
}

