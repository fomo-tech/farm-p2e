import React from "react";
import bg_farm from "assets/images/_bg.jpeg";
import HomFarm from "./components/HomeFarm";
import NoticeBar from "components/ui/home/NoticeBar";

const Home = () => {
  return (
    <>
      <NoticeBar />
      <div
        style={{
          background: `url(${bg_farm})`,
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
        }}
        className="w-full h-screen relative overflow-hidden"
      >
        <div className="absolute max-w-[400px] w-full left-1/2 top-[65%] translate-x-[-50%]  translate-y-[-50%]">
          <div className="w-full max-w-[400px] mx-auto aspect-square relative overflow-visible">
            <HomFarm />
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
