import { Plus, Github, ExternalLink, Linkedin } from "lucide-react";
import Link from "next/link";

const Sidebar = () => {
  return (
    <nav className="h-full bg-gray">
      <div className="h-full flex flex-col justify-between items-center px-4 py-6">
        <div className="grid gap-6">
          <div className="bg-white shadow-md border border-secondary/10 text-secondary/20 rounded-xl p-3 transition ease-in-out hover:text-secondary hover:scale-90">
            <Plus />
          </div>
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
  );
};

export default Sidebar;
