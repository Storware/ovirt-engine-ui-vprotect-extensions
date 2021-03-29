interface Route {
  path: string;
  component: () => JSX.Element;
}

export type RouteList = Route[];
