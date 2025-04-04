
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './App.css';
import { Welcome } from './authpage/Welcome';
import { Registerpage } from './authpage/Registerpage';
import { Login } from './authpage/Login';
import { Topbar } from './layout/Topbar';
import { Home } from './components/Home';
import { Mycourse } from './components/Mycourse';
import { Mylearning } from './components/Mylearning';
import { Profile } from './components/Profile';




function App() {
  const router=createBrowserRouter([
    {
      path:"",
      element:<Welcome/>
    },
    {
      path:"register",
      element:<Registerpage/>
    },
    {
      path:"login",
      element:<Login/>
    },
    {
      path:"/",
      element:<Topbar/>,
      children:[
        {
          path:"home",
          element:<Home/>
        },
      
        {
          path:"myclass",
          element:<Mycourse/>
        },
        {
          path:"mylearning",
          element:<Mylearning/>
        },
        {path:"profile",
          element:<Profile/>
        }


      ]


      
    }
     



  ])


  return (
   <>
  <RouterProvider router={router}/>
   </>
  );
}

export default App;
