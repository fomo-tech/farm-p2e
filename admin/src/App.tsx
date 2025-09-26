import { Toaster } from 'sonner';
import { RouterProvider } from 'react-router-dom';
import { browserRouter } from './routes/browserRouter';
import { useDispatch } from 'react-redux';
import { RootState, store } from './store';
import http from './utils/http';
import { apiRoutes } from './routes/api';
import { login, logout } from './store/slices/adminSlice';
import { useEffect } from 'react';


function App() {

  const state: RootState = store.getState();
  const dispatch = useDispatch();




  const getAdmin = async () => {
    try {
      const res = await http.get(apiRoutes.getAdmin);
      if (res && res.data) {
        dispatch(
          login({
            ...state.admin,
            admin: res.data?.data,
          })
        );
      }
    } catch (error) {
      console.log(error);
      dispatch(logout());

    }
  };

  useEffect(() => {
    getAdmin();
  }, [state.admin]);


  return (
    <div className="fade-in">
      <RouterProvider router={browserRouter} />
      <Toaster />
    </div>
  );
}

export default App;
