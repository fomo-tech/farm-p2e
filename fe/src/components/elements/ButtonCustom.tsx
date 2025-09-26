import React, { ReactNode } from "react";

interface Props {
  bgImg: string;
  title: string | ReactNode;
  width?: number;
  height?: number;
  onEvent: () => void;
}

const ButtonImage = ({ bgImg, width, height, title = "", onEvent }: Props) => {
  return (
    <div
      onClick={onEvent}
      className="relative cursor-pointer"
      style={{
        width: width ? `${width}px` : "100%",
        height: height ? `${height}px` : "100%",
      }}
    >
      <img src={bgImg} alt={""} className="w-full h-full object-contain" />
      <div className="absolute inset-0 flex justify-center items-center">
        <h4 className="text-white font-bold text-[10px]">{title}</h4>
      </div>
    </div>
  );
};

export default ButtonImage;
