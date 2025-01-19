import { PanelLeftClose, Trash2 } from "lucide-react";
import Link from "next/link";
import NewChatButton from "./NewChatButton";
import Image from "next/image";
import Logo from "../assets/mlawlogo.svg";

const Sidebar = ({
  isOpen,
  toggleSidebar,
  chatHistory,
  loadChat,
  startNewChat,
  deleteChat,
}) => {
  return (
    <>
      <nav
        className={`h-full bg-gray fixed inset-0 lg:relative transition-transform transform lg:translate-x-0 z-50 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } w-fit lg:min-w-64`}
      >
        <div className="h-full flex flex-col justify-between items-center px-4 py-6">
          <div>
            <div className="fixed top-4 left-4 z-50">
              <PanelLeftClose
                onClick={toggleSidebar}
                className="transition hover:text-primary lg:hidden cursor-pointer"
              />
            </div>
            <NewChatButton startNewChat={startNewChat} />
            <div className="mt-4">
              {chatHistory.map((chat, index) => (
                <div
                  key={index}
                  className="transition hover:bg-white flex justify-between items-center w-full p-2 rounded-xl"
                >
                  <button
                    onClick={() => loadChat(index)}
                    className="block w-full lg:w-44 text-left text-sm lg:truncate"
                  >
                    {chat[0]?.content || "Untitled Chat"}
                  </button>
                  <button
                    onClick={() => deleteChat(index)}
                    className="transition text-secondary hover:text-red-700 ms-4"
                    aria-label="Delete chat"
                  >
                    <Trash2 width={20} />
                  </button>
                </div>
              ))}
            </div>
          </div>
          <Link
            href="https://mlaw.dk/"
            target="_blank"
            title="Besøg Mieritz Advokatfirma"
          >
            <Image
              src={Logo}
              width="50"
              alt="Mlaw Logo Square"
              className="m-auto"
            />
          </Link>
        </div>
      </nav>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black opacity-30 lg:hidden"
          onClick={toggleSidebar}
        ></div>
      )}
    </>
  );
};

export default Sidebar;
