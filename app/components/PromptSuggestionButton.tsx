const PromptSuggestionButton = ({ text, onClick }) => {
  return (
    <button 
      className="m-2 py-2 px-4 text-sm border border-secondary/30 bg-white rounded-lg text-secondary transition hover:bg-primary hover:text-white hover:border-primary"
      onClick={onClick}
    >
      {text}
    </button>
  )
}

export default PromptSuggestionButton