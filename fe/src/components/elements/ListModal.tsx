import React from "react";

interface Props {
  children: React.ReactNode;
}

const ListModal = ({ children }: Props) => {
  return <div className="flex flex-col">{children}</div>;
};

const ListItem = ({ children }: Props) => {
  return (
    <div className="h-[70px] bg-[#733e39] shadow-[4px_4px_0_#ccc] rounded-[10px] mb-[7px] p-[5px] flex justify-between items-center">
      {children}
    </div>
  );
};

export default ListModal;
export { ListItem };
