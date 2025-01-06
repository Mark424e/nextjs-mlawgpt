import { Github, ExternalLink, Linkedin, PanelLeftOpen } from "lucide-react";
import Link from "next/link";
import NewChatButton from "./NewChatButton";

const Sidebar = ({ isOpen, toggleSidebar }) => {
  return (
    <>
      <nav
        className={`h-full bg-gray fixed inset-0 lg:relative transition-transform transform lg:translate-x-0 z-50 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } w-fit`}
      >
        <div className="h-full flex flex-col justify-between items-center px-4 py-6">
          <div>
            <div className="fixed top-4 left-4 z-50">
              <PanelLeftOpen
                onClick={toggleSidebar}
                className="transition hover:text-primary lg:hidden"
              />
            </div>
            <NewChatButton />
          </div>
          <div className="grid gap-6">
            <Link href="https://mlaw.dk/" target="_blank">
              <ExternalLink className="transition hover:text-primary" />
            </Link>
            <Link href="https://github.com/Mark424e">
              <Github className="transition hover:text-primary" />
            </Link>
            <Link href="https://www.linkedin.com/in/markphillip1800/">
              <Linkedin className="transition hover:text-primary" />
            </Link>
          </div>
        </div>
      </nav>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black opacity-30 md:hidden"
          onClick={toggleSidebar}
        ></div>
      )}
    </>
  );
};

export default Sidebar;
