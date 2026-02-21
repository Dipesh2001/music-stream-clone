// frontend/src/components/common/SkeletonForm.tsx
import React from 'react';

interface SkeletonFormProps {
  fields?: number; // Number of skeleton input fields
  className?: string; // Additional Tailwind CSS classes for the form container
}

const SkeletonForm: React.FC<SkeletonFormProps> = ({ fields = 3, className = '' }) => {
  const formFields = Array.from({ length: fields }, (_, i) => (
    <div key={i} className="mb-4">
      <div className="h-4 bg-gray-300 rounded w-1/4 mb-2"></div> {/* Label skeleton */}
      <div className="h-10 bg-gray-200 rounded w-full"></div> {/* Input field skeleton */}
    </div>
  ));

  return (
    <div className={`animate-pulse p-6 bg-white shadow-md rounded-lg ${className}`}>
      {formFields}
      <div className="h-10 bg-blue-300 rounded w-32 mt-6"></div> {/* Button skeleton */}
    </div>
  );
};

export default SkeletonForm;
