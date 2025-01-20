"use client";
import { useChat } from "ai/react";
import { Message } from "ai";
import Bubble from "./components/Bubble";
import LoadingBubble from "./components/LoadingBubble";
import PromptSuggestionsRow from "./components/PromptSuggestionsRow";
import Image from "next/image";
import MieritzAILogo from "./assets/mieritzailogo.svg";
import Sidebar from "./components/Sidebar";
import { useState, useEffect } from "react";
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
  const [chatHistory, setChatHistory] = useState([]);
  const [currentMessages, setCurrentMessages] = useState(messages);
  const [initialPromptSubmitted, setInitialPromptSubmitted] = useState(false);

  useEffect(() => {
    const savedChats = JSON.parse(localStorage.getItem("chatHistory")) || [];
    setChatHistory(savedChats);
  }, []);

  useEffect(() => {
    localStorage.setItem("chatHistory", JSON.stringify(chatHistory));
  }, [chatHistory]);

  useEffect(() => {
    setCurrentMessages(messages);
  }, [messages]);

  useEffect(() => {
    if (initialPromptSubmitted) {
      const updatedChatHistory = [...chatHistory];
      updatedChatHistory[updatedChatHistory.length - 1] = currentMessages;
      setChatHistory(updatedChatHistory);
    }
  }, [currentMessages]);

  const handlePrompt = (promptText) => {
    const msg: Message = {
      id: crypto.randomUUID(),
      content: promptText,
      role: "user",
    };
    append(msg);
    if (!initialPromptSubmitted) {
      setChatHistory([...chatHistory, [msg]]);
      setInitialPromptSubmitted(true);
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (input.trim()) {
      const newMessage: Message = {
        id: crypto.randomUUID(),
        content: input,
        role: "user",
      };
      append(newMessage);
      if (!initialPromptSubmitted) {
        setChatHistory([...chatHistory, [newMessage]]);
        setInitialPromptSubmitted(true);
      }
      handleInputChange({ target: { value: "" } } as React.ChangeEvent<HTMLInputElement>);
    }
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const loadChat = (index) => {
    const selectedChat = chatHistory[index];
    setCurrentMessages(selectedChat);
    if (isSidebarOpen) {
      setIsSidebarOpen(false);
    }
  };

  const startNewChat = () => {
    setInitialPromptSubmitted(false);
    window.location.reload();
  };

  const deleteChat = (index) => {
    const updatedChatHistory = chatHistory.filter((_, i) => i !== index);
    setChatHistory(updatedChatHistory);
    localStorage.setItem("chatHistory", JSON.stringify(updatedChatHistory));
  };

  const noMessages = !currentMessages || currentMessages.length === 0;

  return (
    <>
      <Sidebar
        isOpen={isSidebarOpen}
        toggleSidebar={toggleSidebar}
        chatHistory={chatHistory}
        loadChat={loadChat}
        startNewChat={startNewChat}
        deleteChat={deleteChat}
      />

      <div className="lg:hidden fixed transition text-secondary hover:text-primary bg-white rounded top-4 left-4">
        <PanelLeftOpen onClick={toggleSidebar} className="cursor-pointer" />
      </div>

      <main>
        <div className="main-content">
          <section className={noMessages ? "" : "populated"}>
            <div className="chat-container">
              <div className="lg:w-1/2 mx-auto lg:ps-0">
                {noMessages ? (
                  <>
                    <Image src={MieritzAILogo} alt="MieritzAI Logo" className="m-auto mb-4 w-[125px] lg:w-[200px]" />
                    <h1 className="mb-8 text-2xl font-semibold leading-none tracking-tight text-secondary">
                      Din juridiske AI assistent
                    </h1>
                    <p className="px-10 mb-2">
                      Vælg en prompt nedenfor, eller skriv din egen for at starte
                      en samtale med MieritzAi
                    </p>
                    <PromptSuggestionsRow onPromptClick={handlePrompt} />
                  </>
                ) : (
                  <>
                    {currentMessages.map((message, index) => (
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
              onSubmit={handleFormSubmit}
              className="h-16 w-full flex rounded-3xl overflow-hidden"
            >
              <input
                className="w-[85%] p-3 lg:text-sm bg-gray"
                onChange={handleInputChange}
                value={input}
                placeholder="Skriv din besked..."
              />
              <input
                className="w-[25%] md:w-[15%] p-[10px] lg:text-sm border-none text-white bg-primary transition hover:bg-primary/50 cursor-pointer"
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