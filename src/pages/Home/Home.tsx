import { FC } from "react";
import Weather from "shared/widgets/Weather";

const Home: FC = () => {
  return (
    <div>
      <h2>This is my weather widget</h2>
      <Weather />
    </div>
  );
};

export default Home;
