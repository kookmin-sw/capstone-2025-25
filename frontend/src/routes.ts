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
    route('mindmap/:id', 'pages/mindmap.tsx'),
    route('today', 'pages/today.tsx'),
    route('matrix', 'pages/matrix.tsx'),
    route('inventory', 'pages/inventory.tsx'),
    route('inventory/:id', 'pages/inventoryDetail.tsx'),
    route('brainstorming', 'pages/brainstorming.tsx'),
  ]),

  route('auth/login/callback', 'pages/callback.tsx'),
  route('onboarding', 'pages/onboarding.tsx'),

  route('*', 'pages/NotFound.tsx'),
] satisfies RouteConfig;
