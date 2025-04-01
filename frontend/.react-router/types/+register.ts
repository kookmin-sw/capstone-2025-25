import "react-router";

declare module "react-router" {
  interface Register {
    params: Params;
  }
}

type Params = {
  "/": {};
  "/login": {};
  "/register": {};
  "/mindmap": {};
  "/today-list": {};
  "/matrix": {};
  "/pomodoro": {};
  "/list": {};
  "/dashboard": {};
};