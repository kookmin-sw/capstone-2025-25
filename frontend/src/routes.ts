import {
  type RouteConfig,
  route,
  index,
  layout,
} from '@react-router/dev/routes';

export default [
  layout('layouts/AuthLayout.tsx', [
    route('login', 'pages/login.tsx'),
    route('register', 'pages/register.tsx'),
  ]),

  layout('layouts/DefaultLayout.tsx', [
    index('pages/home.tsx'),
    route('mindmap', 'pages/mindmap.tsx'),
    route('list', 'pages/list.tsx'),
    route('dashboard', 'pages/dashboard.tsx'),
  ]),
] satisfies RouteConfig;
