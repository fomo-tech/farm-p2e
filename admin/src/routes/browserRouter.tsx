import { createBrowserRouter } from 'react-router-dom';
import AuthLayout from '../components/auth/AuthLayout';
import ErrorPage from '../components/errorPage';
import Layout from '../components/layout';
import Redirect from '../components/layout/Redirect';
import NotFoundPage from '../components/notfoundPage';
import { webRoutes } from './web';
import loadable from '@loadable/component';
import ProgressBar from '../components/loader/progressBar';
import RequireAuth from './requireAuth';
import Login from '../components/auth/Login';
import About from '../components/demo-pages/about';
import Setting from '../components/demo-pages/about';
import UserDetail from '../components/users/user-detail';
import Codes from '../components/codes';
import Package from '../components/invest-pack';
import Event from '../components/event/Event';
import Wallet from '../components/wallet/Wallet';

const errorElement = <ErrorPage />;
const fallbackElement = <ProgressBar />;

const Dashboard = loadable(() => import('../components/dashboard'), {
  fallback: fallbackElement,
});
const Users = loadable(() => import('../components/users'), {
  fallback: fallbackElement,
});



const Deposits = loadable(() => import('../components/deposit'), {
  fallback: fallbackElement,
});

const Withdraw = loadable(() => import('../components/withdraw'), {
  fallback: fallbackElement,
});

const HistoryUser = loadable(() => import('../components/history-user'), {
  fallback: fallbackElement,
});

const TicketHistory = loadable(() => import('../components/tickets'), {
  fallback: fallbackElement,
});

export const browserRouter = createBrowserRouter([
  {
    path: webRoutes.home,
    element: <Redirect />,
    errorElement: errorElement,
  },

  // auth routes
  {
    element: <AuthLayout />,
    errorElement: errorElement,
    children: [
      {
        path: webRoutes.login,
        element: <Login />,
      },
    ],
  },

  // protected routes
  {
    element: (
      <RequireAuth>
        <Layout />
      </RequireAuth>
    ),
    errorElement: errorElement,
    children: [
      {
        path: webRoutes.dashboard,
        element: <Dashboard />,
      },
      {
        path: webRoutes.users,
        element: <Users />,
      },
      {
        path: webRoutes.userDetail,
        element: <UserDetail />,
      },
      {
        path: webRoutes.deposit,
        element: <Deposits />,
      },
      {
        path: webRoutes.withdraw,
        element: <Withdraw />,
      },
      {
        path: webRoutes.historyUser,
        element: <HistoryUser />,
      },
      {
        path: webRoutes.setting,
        element: <Setting />,
      },
      {
        path: webRoutes.event,
        element: <Event />,
      },
      {
        path: webRoutes.wallet,
        element: <Wallet />,
      },
      {
        path: webRoutes.pack,
        element: <Package />,
      },
      {
        path: webRoutes.about,
        element: <About />,
      },
      {
        path: webRoutes.tickets,
        element: <TicketHistory />,
      },
      {
        path: webRoutes.codes,
        element: <Codes />,
      },
    ],
  },

  // 404
  {
    path: '*',
    element: <NotFoundPage />,
    errorElement: errorElement,
  },
]);
