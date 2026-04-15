import { FaPlay, FaPause } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { useEffect, useRef, useState } from "react";
import { tracks } from "../data/data";
import "swiper/css";
import "./TrackModal.css";

const TrackModal = ({ isClicked, setIsClicked, player }) => {
  const swiperRef = useRef(null);
  const isUserDraggingRef = useRef(false);
  const lastSyncedIndexRef = useRef(player.currentIndex);

  useEffect(() => {
    if (isClicked && swiperRef.current) {
      swiperRef.current.slideToLoop(player.currentIndex, 0);
      lastSyncedIndexRef.current = player.currentIndex;
    }
  }, [isClicked]);

  useEffect(() => {
    if (isClicked && swiperRef.current && !isUserDraggingRef.current) {
      if (lastSyncedIndexRef.current !== player.currentIndex) {
        swiperRef.current.slideToLoop(player.currentIndex, 300);
        lastSyncedIndexRef.current = player.currentIndex;
      }
    }
  }, [player.currentIndex, isClicked]);

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

  return (
    <AnimatePresence>
      {isClicked && (
        <>
          <motion.div
            className="track-modal"
            initial={{ y: 200, x: "-50%", opacity: 0 }}
            animate={{ y: 20, x: "-50%", opacity: 1 }}
            exit={{ y: 200, x: "-50%", opacity: 0 }}
            transition={{ type: "spring", damping: 22, stiffness: 180 }}
          >
            <button onClick={() => setIsClicked(false)}></button>
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
        </>
      )}
    </AnimatePresence>
  );
};

export default TrackModal;
