import React from "react";
import HomeIMG from "assets/images/content/HomeHibank.png";
import Classes from "views/home/styles/Home.module.scss";
import packageJson from "../../package.json";

const Home = () => {
  return (
    <div className={Classes["home"]}>
      <img src={HomeIMG} className={Classes["home-img"]} />
      <p className={Classes["home-version"]}>version: {packageJson.version}</p>
    </div>
  );
};
export default Home;
