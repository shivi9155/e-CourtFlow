import { Loader } from 'lucide-react';

export default function LoadingSpinner() {
  return (
    <div className="flex justify-center items-center py-20">
      <Loader className="h-8 w-8 text-blue-600 animate-spin" />
    </div>
  );
}