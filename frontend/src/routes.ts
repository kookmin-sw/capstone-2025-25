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
    route('auth/login/callback', 'pages/callback.tsx'),
  ]),

  layout('layouts/DefaultLayout.tsx', [
    index('pages/home.tsx'),
    route('mindmap', 'pages/mindmap.tsx'),
    route('mindmap/:id', 'pages/mindmapDetail.tsx'),
    route('today', 'pages/today.tsx'),
    route('matrix', 'pages/matrix.tsx'),
    route('pomodoro/:id?', 'pages/pomodoro.tsx'),
    route('list', 'pages/list.tsx'),
    route('dashboard', 'pages/dashboard.tsx'),
  ]),
] satisfies RouteConfig;
