import { FC } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import * as RoutePaths from "./paths";
import * as RoutePages from "pages";

const RouterWrapper: FC = () => {
  return (
    <Router>
      <Switch>
        <Route exact path={RoutePaths.HOME_PATH} component={RoutePages.Home} />
      </Switch>
    </Router>
  );
};

export default RouterWrapper;
