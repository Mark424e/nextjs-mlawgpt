import { Plus } from "lucide-react";

const NewChatButton = () => {
  const handleNewChat = () => {
    window.location.reload();
  };

  return (
    <button
      onClick={handleNewChat}
      className="bg-white shadow-md border border-secondary/10 text-secondary/20 rounded-xl p-6 transition ease-in-out hover:text-secondary hover:scale-90 flex"
      aria-label="Start a new chat"
    >
      <Plus />
    </button>
  );
};

export default NewChatButton;
