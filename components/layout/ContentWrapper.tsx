import { ArrowBigRightDash, Dot, LogOut } from 'lucide-react';
import { useRouter } from 'next/router';

interface Props {
  children: React.ReactNode;
  title?: string;
}

export default function ContentWrapper({ children, title }: Props) {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/');
  };

  return (
    <div className="w-full bg-gray-100">
      {title && (
        <div className="w-full bg-secondary-400 px-6 py-2 flex items-center justify-between">
          <h1 className="text-2xl text-white inline-flex items-center gap-2">
            <ArrowBigRightDash className='inline w-6 h-6' /> {title}
          </h1>
          <button onClick={handleLogout} className="text-white hover:text-gray-200">
            <LogOut className="w-6 h-6" />
          </button>
        </div>
      )}
      <div className="p-6 md:p-8">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 ring-1 ring-gray-100 p-6 space-y-4">
          {children}
        </div>
      </div>
    </div>
  );
}
