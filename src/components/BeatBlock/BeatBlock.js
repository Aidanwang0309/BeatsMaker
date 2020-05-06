import React, { useState, useRef, useEffect } from "react";
import css from './BeatBlock.module.scss';
import classnames from "classnames";

export const BeatBlock = ({ time, handleBlockClick, color, isPlay, isActive, name, note, isSelected }) => {
    const shadowStyle = { 'background': `linear-gradient(225deg, ${color}, ${color})` }
    const handleClick = () => {
        handleBlockClick({ isSelected, name, time, note });
    }
    const cxs = classnames(css.block, isActive && css['block-active'])
    return (
        <div className={cxs} onClick={handleClick} style={isSelected ? shadowStyle : null}>
        </div>
    )
}
