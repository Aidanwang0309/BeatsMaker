import React, { useState } from 'react'
import css from "./Controller.module.scss"
// import { Button } from "components"
import Button from '@material-ui/core/Button';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import StopIcon from '@material-ui/icons/Stop';
import TextField from '@material-ui/core/TextField';
import Select from '@material-ui/core/Select';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';


export const Controller = ({ isPlay, bpm, setBPM, onToggle, disabled, patterns, activePattern, handPatternSelect }) => {

    const handleBPMChange = (e) => {
        setBPM(e.target.value)
    }

    const handleClick = () => {
        onToggle()
    }

    const handleChange = (e) => {
        const activePattern = patterns.filter(pattern => pattern.name === e.target.value)
        handPatternSelect(activePattern[0])
    }

    return (
        <div className={css.controller}>
            <Button
                disabled={disabled}
                onClick={handleClick}
                variant="contained"
                className={css['controller-button']}
                startIcon={isPlay ? <StopIcon /> : <PlayArrowIcon />}
            >
                Play
            </Button>
            <div className={css['controller-bpm']} >
                <input
                    id="bpm"
                    className={css['controller-bpm-input']}
                    value={bpm}
                    onChange={handleBPMChange}
                />
                <label
                    for="bpm"
                    className={css['controller-bpm-label']}
                >BPM</label>
            </div>
            <div className={css['controller-pattern']} >
                <FormControl className={css['controller-pattern-input']} >
                    <InputLabel id="demo-simple-select-label">Pattern</InputLabel>
                    <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={activePattern.name}
                        onChange={handleChange}
                    >
                        {
                            patterns.map(pattern => <MenuItem value={pattern.name}>{pattern.name}</MenuItem>)
                        }
                    </Select>
                </FormControl>
            </div>
        </div>
    )
}
