import { Html, useProgress } from "@react-three/drei";
import { satellite } from "../assets";
import { styles } from '../styles';


const CanvasLoader = () => {
  const { progress } = useProgress();
  return (
    <Html
      as='div'
      center
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
      }}
    >
      <span className='canvas-loader'></span>
      <p
        style={{
          fontSize: 14,
          color: "#F1F1F1",
          fontWeight: 800,
          marginTop: 40,
        }}
      >
        {progress.toFixed(2)}%
      </p>
    </Html>
  );
};

const AppLoader = () => {
  return (
    <div 
      className="absolute justify-center items-center flex w-screen h-screen gap-5">
        <span className='spinner items-center sm:size-[50%]'></span>
        <h1 className={`${styles.heroHeadText} sm:size-[50%] text-white`}>
          Sto caricando il sito...
        </h1>
    </div>
  );
};


export default CanvasLoader;
export {AppLoader};


