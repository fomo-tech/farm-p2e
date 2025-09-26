//config.ts

enum LayoutType {
  MIX = 'mix',
  TOP = 'top',
  SIDE = 'side',
}

const CONFIG = {
  appName: 'Investment',
  helpLink: 'https://github.com/arifszn/reforge',
  enablePWA: true,
  theme: {
    accentColor: '#1bb757',
    sidebarLayout: LayoutType.SIDE,
    showBreadcrumb: true,
  },
  metaTags: {
    title: 'Investment',
    description: 'Quản lý thông tin dự án game',
    imageURL: 'logo.svg',
  },
};

export default CONFIG;
