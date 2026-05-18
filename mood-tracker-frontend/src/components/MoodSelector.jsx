import React from 'react'
import MoodCanvasFace from './MoodCanvasFace'

const MOODS = ['Happy', 'Neutral', 'Sad']

/**
 * Three-option mood picker with canvas faces.
 * @param {{ selectedMood: string|null, onSelect: (mood: string) => void }} props
 */
export default function MoodSelector({ selectedMood, onSelect }) {
  return (
    <div className="mood-selector" role="radiogroup" aria-label="Select your mood">
      {MOODS.map((mood) => {
        const isSelected = selectedMood === mood
        const selectedClass = isSelected ? `selected selected-${mood.toLowerCase()}` : ''
        return (
          <button
            key={mood}
            type="button"
            role="radio"
            aria-checked={isSelected}
            className={`mood-option ${selectedClass}`}
            onClick={() => onSelect(mood)}
          >
            <MoodCanvasFace mood={mood} size={60} animated={isSelected} />
            <span className="mood-option-label">{mood}</span>
          </button>
        )
      })}
    </div>
  )
}
