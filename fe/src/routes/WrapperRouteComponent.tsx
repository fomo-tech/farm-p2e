import type { FC, ReactElement } from "react";
import PrivateRoute from "./PrivateRoutes";

interface WrapperRouteProps {
  title: string;
  auth?: boolean;
  element: ReactElement;
}

const WrapperRouteComponent: FC<WrapperRouteProps> = ({
  title,
  auth,
  element,
}) => {

  if (title) {
    document.title = title
  }
  return auth ? <PrivateRoute element={element}/>: element;
};

export default WrapperRouteComponent;