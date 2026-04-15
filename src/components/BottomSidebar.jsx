import { motion, AnimatePresence } from "framer-motion";
import { FaPlay, FaPause } from "react-icons/fa";
import { Swiper, SwiperSlide } from "swiper/react";
import { useEffect, useRef } from "react";
import { tracks } from "../data/data";
import "swiper/css";
import "./BottomSidebar.css";

const BottomSidebar = ({ isFirstPlaying, player, setIsClicked }) => {
  const swiperRef = useRef(null);
  const isUserDraggingRef = useRef(false);
  const lastSyncedIndexRef = useRef(player.currentIndex);

  // При появлении сайдбара синхронизируем слайдер с текущим треком
  useEffect(() => {
    if (isFirstPlaying && swiperRef.current) {
      swiperRef.current.slideToLoop(player.currentIndex, 0);
      lastSyncedIndexRef.current = player.currentIndex;
    }
  }, [isFirstPlaying]);

  // Синхронизируем слайдер когда трек меняется ИЗ другого компонента
  useEffect(() => {
    if (isFirstPlaying && swiperRef.current && !isUserDraggingRef.current) {
      // Только если индекс действительно изменился
      if (lastSyncedIndexRef.current !== player.currentIndex) {
        swiperRef.current.slideToLoop(player.currentIndex, 300);
        lastSyncedIndexRef.current = player.currentIndex;
      }
    }
  }, [player.currentIndex, isFirstPlaying]);

  const handleSlideChange = (swiper) => {
    isUserDraggingRef.current = true;
    const newIndex = swiper.realIndex;

    if (newIndex !== player.currentIndex) {
      player.handleTrackChange(newIndex);
      lastSyncedIndexRef.current = newIndex;
    }

    setTimeout(() => {
      isUserDraggingRef.current = false;
    }, 100);
  };

  const handlePlayClick = (e) => {
    e.stopPropagation();
    player.togglePlay();
  };

  const handleSidebarClick = (e) => {
    if (e.target.closest(".play-button-sidebar")) {
      return;
    }
    setIsClicked(true);
  };

  return (
    <div className="" onClick={handleSidebarClick}>
      <AnimatePresence>
        {isFirstPlaying && (
          <motion.div
            className="bottom-sidebar"
            initial={{ y: 100, x: "-50%", opacity: 0 }}
            animate={{ y: 0, x: "-50%", opacity: 1 }}
            exit={{ y: 100, x: "-50%", opacity: 0 }}
            transition={{ type: "spring", damping: 22, stiffness: 180 }}
          >
            <Swiper
              onSwiper={(swiper) => {
                swiperRef.current = swiper;
                swiper.slideToLoop(player.currentIndex, 0);
                lastSyncedIndexRef.current = player.currentIndex;
              }}
              spaceBetween={20}
              slidesPerView={1}
              loop={true}
              className="tracks-swiper"
              onSlideChange={handleSlideChange}
            >
              {tracks.map((track, index) => (
                <SwiperSlide key={index} className="track-slide">
                  <img src={track.img} className="track-img" alt={track.name} />
                  <div className="track-info-text">
                    <h3 className="track-name">{track.name}</h3>
                    <p className="track-author">{track.author}</p>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>

            <button className="play-button-sidebar" onClick={handlePlayClick}>
              {!player.isPlaying ? (
                <FaPlay color="white" size={"24px"} />
              ) : (
                <FaPause color="white" size={"24px"} />
              )}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default BottomSidebar;
