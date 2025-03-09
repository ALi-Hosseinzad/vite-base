import React from "react";
import loading from "../../assets/animation/Loading.json";
import Classes from "./Loading.module.scss";
import Dictionary from "helpers/Dictionary";
import { usePromiseTracker } from "react-promise-tracker";
import Lottie from "react-lottie-player";

export function Loading() {
  const { promiseInProgress } = usePromiseTracker();

  return promiseInProgress === true ? (
    <div className={Classes["overlay-loading"]}>
      <div className={Classes["loading-box"]}>
        <Lottie loop animationData={loading} play style={{ width: 70, height: 70 }} />
      </div>
    </div>
  ) : null;
}
