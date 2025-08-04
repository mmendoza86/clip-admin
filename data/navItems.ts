// data/navItems.ts
export interface NavItem {
  title: string;
  url: string;
  icon: string;
  isActive?: boolean;
  role: string[];
  items?: NavItem[];
}

export const navItems: NavItem[] = [
  {
    title: 'Clientes',
    url: '/dashboard/clientes',
    icon: 'user',
    role: ['admin'],
    items: []
  },
  {
    title: 'Reportes CLIP',
    url: '',
    icon: 'fileText',
    role: ['admin'],
    items: [
      {
        title: 'Depósitos',
        url: '/dashboard/depositos',
        icon: 'download',
        role: ['admin']
      },
      {
        title: 'Transacciones',
        url: '/dashboard/transacciones',
        icon: 'dollarSign',
        role: ['admin']
      }
    ]
  },
  {
    title: 'Conciliaciones',
    url: '/dashboard/conciliaciones',
    icon: 'conciliation',
    role: ['admin']
  },
  {
    title: 'Historial',
    url: '/dashboard/historial',
    icon: 'history',
    role: ['admin'],
    items: []
  }
];
