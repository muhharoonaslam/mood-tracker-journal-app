import React from 'react'
import MoodCanvasFace from './MoodCanvasFace'

const MOODS = ['Happy', 'Neutral', 'Sad']

/**
 * Three-option mood picker with canvas faces.
 * Now used as a standalone component if needed; primary use is inside MoodForm.
 * @param {{ selectedMood: string|null, onSelect: (mood: string) => void }} props
 */
export default function MoodSelector({ selectedMood, onSelect }) {
  return (
    <div className="mood-cards-row" role="radiogroup" aria-label="Select your mood">
      {MOODS.map((mood) => (
        <button
          key={mood}
          type="button"
          role="radio"
          aria-checked={selectedMood === mood}
          className={`mood-card${selectedMood === mood ? ' selected' : ''}`}
          onClick={() => onSelect(mood)}
        >
          <MoodCanvasFace
            mood={mood}
            size={70}
            fill={selectedMood === mood ? '#ffffff' : '#F0EAD6'}
          />
          <div className="mood-card-label">{mood}</div>
        </button>
      ))}
    </div>
  )
}
