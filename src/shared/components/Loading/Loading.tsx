import { Spin } from "antd";
import { FC } from "react";
import "./Loading.scss";

const Loading: FC = () => {
  return (
    <div className="app__loading">
      <Spin />
    </div>
  );
};

export default Loading;
