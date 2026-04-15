import "./App.css";
import { useState } from "react";
import { FaPlay, FaPause } from "react-icons/fa";
import BottomSidebar from "./components/BottomSidebar";
import TrackModal from "./components/TrackModal";
import Background from "./components/Background";
import Header from "./components/Header";
import { usePlayer } from "./hooks/usePlayer";

function App() {
  const player = usePlayer();
  const [isFirstPlaying, setIsFirstPlaying] = useState(false);
  const [isClicked, setIsClicked] = useState(false);

  const handlePlay = () => {
    player.togglePlay();
    if (!isFirstPlaying) setIsFirstPlaying(true);
  };

  return (
    <div className="App">
      <Header />

      <Background />

      <div className="my-wave-wrapper">
        <h1 className="my-wave-title">Моя волна</h1>
        <button className="my-wave-play-button" onClick={handlePlay}>
          {!player.isPlaying ? (
            <FaPlay color="white" size="27px" />
          ) : (
            <FaPause color="white" size="27px" />
          )}
        </button>
      </div>

      <div className="bottom-sidebar-wrapper">
        <BottomSidebar
          isFirstPlaying={isFirstPlaying}
          player={player}
          setIsClicked={setIsClicked}
        />
      </div>
      {/* <TrackModal
        player={player}
        isClicked={isClicked}
        setIsClicked={setIsClicked}
      /> */}
    </div>
  );
}

export default App;
