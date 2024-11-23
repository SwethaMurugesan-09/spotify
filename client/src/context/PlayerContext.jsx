import { createContext, useEffect, useRef, useState } from "react";
import { songsData } from "../assets/assets";

export const PlayerContext = createContext();

const PlayerContextProvider = (props) => {
    const audioRef = useRef();
    const seekBg = useRef();
    const seekBar = useRef();

    const [track, setTrack] = useState(songsData[0]);
    const [playStatus, setPlayStatus] = useState(false);
    const [time, setTime] = useState({
        currentTime: {
            second: 0,
            minute: 0,
        },
        totalTime: {
            second: 0,
            minute: 0,
        },
    });

    const play = () => {
        audioRef.current.play();
        setPlayStatus(true);
    };
    const pause = () => {
        audioRef.current.pause();
        setPlayStatus(false);
    };

    const playWithId = async (id) => {
        await setTrack(songsData[id]);
        await audioRef.current.play();
        setPlayStatus(true);
    };

    const previous = async () => {
        const currentIndex = songsData.findIndex((song) => song.id === track.id);  // Find the current index of the track
        if (currentIndex > 0) {
            const previousTrack = songsData[currentIndex - 1];
            await setTrack(previousTrack);
            await audioRef.current.play();
            setPlayStatus(true);
        }
    };

    const next = async () => {
        const currentIndex = songsData.findIndex((song) => song.id === track.id);  
        if (currentIndex < songsData.length - 1) {
            const nextTrack = songsData[currentIndex + 1];
            await setTrack(nextTrack);
            await audioRef.current.play();
            setPlayStatus(true);
        }
    };
    const seekSong=async(e)=>{
        audioRef.current.currentTime=((e.nativeEvent.offsetX / seekBg.current.offsetWidth)*audioRef.current.duration)
    }
    useEffect(() => {
        const updateSeekBar = () => {
            if (audioRef.current) {
                seekBar.current.style.width =
                    (audioRef.current.currentTime / audioRef.current.duration) * 100 + "%";
                setTime({
                    currentTime: {
                        second: Math.floor(audioRef.current.currentTime % 60),
                        minute: Math.floor(audioRef.current.currentTime / 60),
                    },
                    totalTime: {
                        second: Math.floor(audioRef.current.duration % 60) || 0,
                        minute: Math.floor(audioRef.current.duration / 60) || 0,
                    },
                });
            }
        };

        if (audioRef.current) {
            audioRef.current.ontimeupdate = updateSeekBar;
        }

    }, [audioRef, seekBar]);

    const contextValue = {
        audioRef,
        seekBg,
        seekBar,
        track,
        setTrack,
        playStatus,
        setPlayStatus,
        time,
        setTime,
        play,
        pause,
        playWithId,
        previous,
        next,
        seekSong
    };

    return (
        <PlayerContext.Provider value={contextValue}>
            {props.children}
        </PlayerContext.Provider>
    );
};

export default PlayerContextProvider;
