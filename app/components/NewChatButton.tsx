import { SquarePen } from "lucide-react";

const NewChatButton = ({ startNewChat }) => {
  return (
    <button
      onClick={startNewChat}
      className="min-w-full mt-8 lg:mt-0 bg-white shadow-md border border-secondary/10 text-secondary rounded-xl p-4 transition ease-in-out hover:scale-95 flex gap-2 justify-center text-start text-nowrap"
      aria-label="Start a new chat"
    >
      Start en ny samtale
      <SquarePen width={18} />
    </button>
  );
};

export default NewChatButton;
