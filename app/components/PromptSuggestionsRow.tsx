import { useState, useEffect } from "react"
import PromptSuggestionButton from "./PromptSuggestionButton"

const PromptSuggestionsRow = ({ onPromptClick }) => {
  const prompts = [
    "Hvem kan hjælpe med juridisk rådgivning?",
    "Hvad koster det at få en advokat?",
    "Hvor kan jeg finde information om arveret?",
    "Hvordan foregår en retssag?",
    "Hvorfor er det vigtigt at have en testamente?",
    "Hvornår skal jeg kontakte en advokat?"
  ]

  const [numPrompts, setNumPrompts] = useState(6)

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setNumPrompts(4)
      } else {
        setNumPrompts(6)
      }
    }

    handleResize()

    window.addEventListener("resize", handleResize)

    return () => window.removeEventListener("resize", handleResize)
  }, [])

  return (
    <div className="w-full">
      {prompts.slice(0, numPrompts).map((prompt, index) => (
        <PromptSuggestionButton
          key={`suggestion-${index}`}
          text={prompt}
          onClick={() => onPromptClick(prompt)}
        />
      ))}
    </div>
  )
}

export default PromptSuggestionsRow
