"use client";
import { useChat } from "ai/react";
import { Message } from "ai";
import Bubble from "./components/Bubble";
import LoadingBubble from "./components/LoadingBubble";
import PromptSuggestionsRow from "./components/PromptSuggestionsRow";
import Image from "next/image";
import MlawGPTLogo from "./assets/MlawGPTLogo.svg";
import Sidebar from "./components/Sidebar";
import { useState } from "react";
import { PanelLeftOpen } from "lucide-react";

const Home = () => {
  const {
    append,
    isLoading,
    messages,
    input,
    handleInputChange,
    handleSubmit,
  } = useChat();

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const noMessages = !messages || messages.length === 0;

  const handlePrompt = (promptText) => {
    const msg: Message = {
      id: crypto.randomUUID(),
      content: promptText,
      role: "user",
    };
    append(msg);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <>
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

      <div className="lg:hidden fixed transition text-secondary hover:text-primary top-4 left-4">
        <PanelLeftOpen onClick={toggleSidebar} className="cursor-pointer" />
      </div>

      <main>
        <div className="main-content">
          <section className={noMessages ? "" : "populated"}>
            <div className="chat-container">
              <div className="lg:w-1/2 mx-auto lg:ps-0">
                {noMessages ? (
                  <>
                    <Image src={MlawGPTLogo} alt="MieritzAI Logo" className="m-auto mb-4 w-[125px] lg:w-[200px]" />
                    <h1 className="mb-8 text-2xl lg:text-4xl font-semibold leading-none tracking-tight text-secondary">
                      Tal jura med mig
                    </h1>
                    <p className="px-20">
                      Vælg en prompt nedenfor, eller skriv din egen for at starte
                      en samtale med MlawGPT.
                    </p>
                    <br />
                    <p className="text-xl text-secondary/60">Spørg om:</p>
                    <PromptSuggestionsRow onPromptClick={handlePrompt} />
                  </>
                ) : (
                  <>
                    {messages.map((message, index) => (
                      <Bubble key={`message-${index}`} message={message} />
                    ))}
                    {isLoading && <LoadingBubble />}
                  </>
                )}
              </div>
            </div>
          </section>
          <div className="w-full lg:w-1/2 border-t border-t-secondary/30 pt-5 px-6 lg:px-0">
            <form
              onSubmit={handleSubmit}
              className="h-16 w-full flex rounded-3xl overflow-hidden"
            >
              <input
                className="w-[85%] p-3 text-sm bg-gray"
                onChange={handleInputChange}
                value={input}
                placeholder="Skriv din besked..."
              />
              <input
                className="w-[25%] md:w-[15%] p-[10px] text-sm border-none text-white bg-primary transition hover:bg-primary/50 cursor-pointer"
                type="submit"
                value="Send"
              />
            </form>
            <div className="mt-5">
              <p className="text-xs">
                Bemærk venligst, at denne AI-assistent giver svar baseret på den
                nyeste viden tilgængelig fra{" "}
                <a
                  className="text-primary underline"
                  href="https://mlaw.dk/"
                  target="_blank"
                >
                  mlaw.dk
                </a>
                . For præcis assistance, undgå venligst at stille spørgsmål, der
                ikke er relateret.
              </p>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default Home;
