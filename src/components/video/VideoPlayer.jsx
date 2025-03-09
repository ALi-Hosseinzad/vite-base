import React from "react";
import ReactPlayer from "react-player";
import Classes from "components/video/VideoPlayer.module.scss";

const VideoPlayer = (props) => {
  const { source, options = null, ...rest } = props;
  return <ReactPlayer url={source} {...rest} className={Classes["video"]} width={335} height={240} controls={true} />;
};

export default VideoPlayer;
