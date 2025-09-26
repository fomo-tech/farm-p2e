import clsx from "clsx";
import { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";


const TabItem = ({ icon, route }: {
    icon: ReactNode,
    active: boolean,
    onClick: () => void,
    route: string
}) => {
    const { pathname } = useLocation()
    return (
        <Link to={route} className={clsx(`tab-item`, {
            "active": route === '/'
        })} >
            <div className="tab-item-inner" >
                {icon}
            </div>
        </Link>
    );
};

export default TabItem;
