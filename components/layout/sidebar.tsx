import { useEffect, useState } from 'react';
import { navItems, NavItem } from '../../data/navItems';
import {
  User,
  FileText,
  Download,
  DollarSign,
  ChevronDown,
  ChevronRight,
  LogOut,
  ChevronLeft,
  ChevronRight as ArrowRight,
  FolderOpen,
  FolderClosed,
  History
} from 'lucide-react';
import { useRouter } from 'next/router';
import clsx from 'clsx';

const icons = {
  user: <User className="w-4 h-4" />,
  fileText: <FileText className="w-4 h-4" />,
  download: <Download className="w-4 h-4" />,
  dollarSign: <DollarSign className="w-4 h-4" />,
  history: <History className="w-4 h-4" />
};

export default function Sidebar({
  onNavigate,
  selectedSection,
  title
}: {
  onNavigate: (section: string) => void;
  selectedSection: string;
  title?: string;
}) {
  const [open, setOpen] = useState<string | null>(null);
  const [collapsed, setCollapsed] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const activeParent = navItems.find(item =>
      item.items?.some(sub => sub.url === router.pathname)
    );
    if (activeParent) {
      setOpen(activeParent.title);
    }
  }, [router.pathname]);

  const handleToggle = (title: string) => {
    setOpen(open === title ? null : title);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/');
  };

  const normalize = (str: string) =>
    str.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

  const renderItems = (items: NavItem[]) =>
    items.map((item, index) => {
      const isParentActive =
        normalize(item.title) === normalize(selectedSection) ||
        item.items?.some(sub => normalize(sub.url) === normalize(selectedSection));

      return (
        <div key={item.title} className="mb-1">
          <button
            onClick={() => item.items?.length ? handleToggle(item.title) : onNavigate(item.url)}
            className={clsx(
              "w-full text-left px-2 py-2 flex items-center rounded transition-colors",
              collapsed ? "justify-center" : "justify-between gap-2 px-4",
              isParentActive ? "bg-primary-700" : "hover:bg-secondary-400"
            )}

          >
            <div className="flex items-center gap-2">
              {icons[item.icon as keyof typeof icons]}
              {!collapsed && item.title}
            </div>
            {!collapsed && item.items?.length > 0 && (
              open === item.title ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />
            )}
          </button>

          {!collapsed && item.items && open === item.title && (
            <div className="ml-5 mt-1 space-y-1">
              {item.items.map(sub => {
                const isSubActive = normalize(sub.title) === normalize(selectedSection);
                return (
                  <button
                    key={sub.title}
                    onClick={() => onNavigate(sub.url)}
                    className={clsx(
                      "block w-full text-left py-2 flex items-center rounded transition-colors",
                      collapsed ? "justify-center px-2" : "gap-2 px-4",
                      isSubActive ? "bg-primary-700" : "hover:bg-secondary-400"
                    )}
                  >
                    {icons[sub.icon as keyof typeof icons]}
                    {!collapsed && sub.title}
                  </button>
                );
              })}
            </div>
          )}

          {!collapsed && index < items.length - 1 && <hr className="my-2 border-white/10" />}
        </div>
      );
    });

  return (
    <div
      className={clsx(
        "bg-primary-600 text-white p-6 flex flex-col justify-between min-h-screen transition-all duration-300",
        collapsed ? "w-20" : "w-64"
      )}
    >
      <div>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="mb-4 text-white hover:text-gray-300"
        >
          {/* buscar un icono que sea como una ventana */}
          {collapsed ? <FolderOpen className="w-5 h-5" /> : <FolderClosed className="w-5 h-5" />}
        </button>
        {!collapsed && <h1 className="text-2xl font-bold mb-6">{title}</h1>}
        {renderItems(navItems)}
      </div>

      <div className="mt-6 border-t border-white/10 pt-4">
        <button
          onClick={handleLogout}
           className={clsx(
              "w-full text-left py-2 rounded flex items-center transition-colors",
              collapsed ? "justify-center px-2" : "gap-2 px-4",
              "bg-secondary-500 hover:bg-secondary-600"
            )}
        >
          <LogOut className="w-4 h-4" />
          {!collapsed && 'Salir'}
        </button>
      </div>
    </div>
  );
}
