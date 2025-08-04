import clsx from 'clsx';
import { ArrowBigRightDash, LogOut } from 'lucide-react';
import { useRouter } from 'next/router';
import { useEffect, useRef, useState } from "react";

interface Props {
  children: React.ReactNode;
  title?: string;
}

export default function ContentWrapper({ children, title }: Props) {
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const contentRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = contentRef.current;
    if (!container) return;

    const handleScroll = () => {
      setScrolled(container.scrollTop > 10);
    };

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/');
  };

  return (
    <div ref={contentRef} className="overflow-y-auto h-screen w-full bg-gray-100">
      {title && (
        <div
          className={clsx(
            "w-full sticky top-0 z-20 transition-all duration-300 bg-secondary-400 px-6 flex items-center justify-between",
            scrolled ? "py-1 shadow-md bg-secondary-300" : "py-3"
          )}
        >
          <h1
            className={clsx(
              "text-white inline-flex items-center gap-2 transition-all duration-300",
              scrolled ? "text-xl" : "text-2xl"
            )}
          >
            <ArrowBigRightDash className="inline w-6 h-6" /> {title}
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
