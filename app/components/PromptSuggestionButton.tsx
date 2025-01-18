const PromptSuggestionButton = ({ text, onClick }) => {
  return (
    <button
      className="grid items-start m-2 py-4 px-4 text-sm text-start  bg-gray rounded-lg text-secondary transition border border-gray hover:border hover:border-primary hover:-translate-y-1 shadow"
      onClick={onClick}
    >
      {text}
    </button>
  );
};

export default PromptSuggestionButton;
