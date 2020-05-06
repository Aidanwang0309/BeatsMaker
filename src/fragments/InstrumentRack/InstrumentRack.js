import React, { useState, useRef, useEffect } from "react";
import { BeatBlock } from "components"
import kickSample from "samples/kick.wav"
import clapSample from "samples/clap.wav"
import snareSample from "samples/snare.wav"
import hatSample from "samples/hat.wav"
import Tone from "tone";
import { Controller } from "fragments"
import { Sampler, Sequence } from "tone";
import css from './InstrumentRack.module.scss';
import { patterns } from "constant/pattern"

const TIME = [0, 0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2, 2.25, 2.5, 2.75, 3, 3.25, 3.5, 3.75];
const BLOCK_NUMBER = 16;
const RACK_DATA = [
    {
        name: 'kick',
        color: '#FC5763',
        note: 'C0',
    },
    {
        name: 'clap',
        color: '#31fdf4',
        note: 'D0',
    },
    {
        name: 'snare',
        color: '#fffa59',
        note: 'E0',
    },
    {
        name: 'hat',
        color: '#ac82ff',
        note: 'F0',
    }
]

export const InstrumentRack = () => {
    const [isLoaded, setLoaded] = useState(false);
    const [time, setTime] = useState(0);
    const [isPlay, setIsPlay] = useState(false);
    const [activePattern, setActivePattern] = useState(patterns[0])
    const [bpm, setBPM] = useState(activePattern.bpm);
    const [beats, setBeats] = useState(activePattern.pattern);
    const Drum = useRef(null);
    const beatID = useRef({ kick: {}, clap: {}, snare: {}, hat: {} });
    const sequence = useRef(null);

    useEffect(() => {
        Drum.current = new Sampler(
            {
                C0: kickSample,
                D0: clapSample,
                E0: snareSample,
                F0: hatSample,
            },
            {
                onload: () => {
                    setLoaded(true);
                }
            }
        ).toMaster();
    }, []);

    useEffect(() => {
        Tone.Transport.bpm.value = bpm;
    }, [bpm])

    useEffect(() => {
        Tone.Transport.loopEnd = '2s'
        Tone.Transport.loop = true
    }, [])

    const trigger = (note) => (time) => {
        Drum.current.triggerAttackRelease(note, '8n', time)
    }

    useEffect(() => {
        //timer
        sequence.current = new Sequence(function (time, note) {
            setTime(note);
        }, TIME, "16n").start(0);

        setBPM(activePattern.bpm);
        setBeats(activePattern.pattern)

        RACK_DATA.map(track => activePattern.pattern[track.name].map((time) => {
            const id = Tone.Transport.schedule(trigger(track.note), `0:${time}`)
            beatID.current = { ...beatID.current, [track.name]: { ...beatID.current[track.name], [time]: id } }
        }))
    }, [activePattern]);


    const handleToggle = () => {
        setIsPlay(x => !x)
        Tone.Transport.toggle();
    }

    const handleBlockClick = ({ isSelected, name, time, note }) => {
        if (isSelected) {
            Tone.Transport.clear(beatID.current[name][time]);
            setBeats({ ...beats, [name]: beats[name].filter(x => x !== time) })
        } else {
            const id = Tone.Transport.schedule(trigger(note), `0:${time}`)
            setBeats({ ...beats, [name]: [...beats[name], time] })
            beatID.current = { ...beatID.current, [name]: { ...beatID.current[name], [time]: id } }
        }
    }

    const handPatternSelect = (pattern) => {
        Tone.Transport.cancel();
        beatID.current = { kick: {}, clap: {}, snare: {}, hat: {} }
        setActivePattern(pattern);
    }

    return (
        <div className={css.rack}>
            <Controller
                disabled={!isLoaded}
                isPlay={isPlay}
                onToggle={handleToggle}
                bpm={bpm}
                setBPM={setBPM}
                patterns={patterns}
                activePattern={activePattern}
                handPatternSelect={handPatternSelect}
            />

            {
                RACK_DATA.map(track => (
                    <div className={css['rack-track']}>
                        {

                            Array.from({ length: BLOCK_NUMBER }).map((block, index) => {
                                const isSelected = beats[track.name].includes(index * 0.25)
                                return <BeatBlock
                                    isSelected={isSelected}
                                    name={track.name}
                                    note={track.note}
                                    color={track.color}
                                    isPlay={isPlay}
                                    time={index * 0.25}
                                    isActive={index * 0.25 === time}
                                    handleBlockClick={handleBlockClick}
                                />
                            })
                        }
                    </div>
                ))
            }
        </div>
    )
}

