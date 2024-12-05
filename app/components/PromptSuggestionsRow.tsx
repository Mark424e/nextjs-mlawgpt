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
  return (
    <div className="w-full">
      {prompts.map((prompt, index) => 
        <PromptSuggestionButton 
          key={`suggestion-${index}`}
          text={prompt}
          onClick={() => onPromptClick(prompt)}
        />)}
    </div>
  )
}

export default PromptSuggestionsRow