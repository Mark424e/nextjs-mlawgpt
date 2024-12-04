const PromptSuggestionButton = ({ text, onClick }) => {
  return (
    <button 
      className="m-2 py-2 px-4 text-sm border-none bg-white rounded-lg text-secondary shadow-lg transition hover:scale-105 hover:bg-primary hover:text-white"
      onClick={onClick}
    >
      {text}
    </button>
  )
}

export default PromptSuggestionButton