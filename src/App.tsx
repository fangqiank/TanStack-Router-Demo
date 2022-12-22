import { lazy } from 'react'
import {createRouteConfig, Link, Outlet, createReactRouter, RouterProvider} from '@tanstack/react-router'
import { Home } from './pages/Home'
import { Store } from './pages/Store'
import { About } from './pages/About'

const TanStackRouterDevtools = import.meta.env.PROD 
  ? () => null
  : lazy(() => import('@tanstack/react-router-devtools').then(res => ({
    default: res.TanStackRouterDevtools
  }))) 

const rootRoute = createRouteConfig()
const indexRoute = rootRoute.createRoute({
  path: '/',
  component: Home 
})

const aboutRoute = rootRoute.createRoute({
  path: 'about',
  component: About
})

const storeRoute = rootRoute.createRoute({
  path: 'store',
  component: Store
})

const postRoute = rootRoute.createRoute({
  path: 'posts',
  loader:async () => {
    console.log('Fetching posts...')
    await new Promise(resolve => setTimeout(resolve, 500))
    const posts = fetch('https://jsonplaceholder.typicode.com/posts')
      .then(res => res.json())
      .then(data => console.log(data.slice(0, 10)))

    return {
      posts
    }
  }
})

const routeConfig = rootRoute.addChildren([indexRoute, aboutRoute, storeRoute])

const router = createReactRouter({routeConfig})

declare module '@tanstack/react-router' {
  interface RegisterRouter {
    router: typeof router
  }
}

function App() {
  return (
    <>
      <RouterProvider router={router} >
        <Link to='/'>Home</Link>
        <br />
        <Link to='/about'>About</Link>
        <br />
        <Link to='/store'>Store</Link>
        <br />
        <Outlet />
      </RouterProvider>
      
      <TanStackRouterDevtools router={router} />   
    </>
  )
}

export default App
