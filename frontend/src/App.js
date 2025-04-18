
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
import { Rolebaseroute } from './authpage/Rolebaseroute';
import { AddLesson } from './Trainercomponents/components/AddLesson';




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
        { path: "home",
          element: (
            <Rolebaseroute roleallowed={["STUDENT", "TRAINER"]}>
              <Home />
            </Rolebaseroute>
          ),
        },
      
        {
          path:"myclass",

          element:(
         <Rolebaseroute roleallowed="TRAINER">
         <Mycourse/>
         </Rolebaseroute>
          ),
        },
        {
          path:"addlesson/:courseid",

          element:(
         <Rolebaseroute roleallowed="TRAINER">
         <AddLesson/>
         </Rolebaseroute>
          ),
        },
        {
          path:"mylearning",
          element: (
            <Rolebaseroute roleallowed="STUDENT">
            <Mylearning/>
            </Rolebaseroute>
             ),
        },
        { path: "profile",
          element: (
            <Rolebaseroute roleallowed={["STUDENT", "TRAINER"]}>
              <Profile />
            </Rolebaseroute>
          ),
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
