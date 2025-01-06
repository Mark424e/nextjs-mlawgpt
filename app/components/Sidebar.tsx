import { PanelLeftOpen } from "lucide-react";
import Link from "next/link";
import NewChatButton from "./NewChatButton";
import Image from "next/image";
import Logo from "../assets/mlawlogo.svg";

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
          <Link href="https://mlaw.dk/" target="_blank" title="Besøg Mieritz Advokatfirma">
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
