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
    append, // Adds a new message to the chat history
    isLoading, // Indicates whether a response is being fetched
    messages, // The current chat messages
    input, // The user's input in the chatbox
    handleInputChange, // Updates the input state
    handleSubmit, // Handles form submission
  } = useChat();

  // Sidebar open/close state
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Stores the complete chat history in an array of message arrays
  const [chatHistory, setChatHistory] = useState([]);

  // Tracks the current session's messages
  const [currentMessages, setCurrentMessages] = useState(messages);

  // Tracks whether the first prompt has been submitted
  const [initialPromptSubmitted, setInitialPromptSubmitted] = useState(false);

  // Loads chat history from localStorage when the component is mounted
  useEffect(() => {
    const savedChats = JSON.parse(localStorage.getItem("chatHistory")) || [];
    setChatHistory(savedChats);
  }, []);

  // Saves chat history to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("chatHistory", JSON.stringify(chatHistory));
  }, [chatHistory]);

  // Keeps the currentMessages state in sync with the messages provided by the `useChat` hook
  useEffect(() => {
    setCurrentMessages(messages);
  }, [messages]);

  // Updates the most recent chat session in chatHistory when messages are updated
  useEffect(() => {
    if (initialPromptSubmitted) {
      const updatedChatHistory = [...chatHistory];
      updatedChatHistory[updatedChatHistory.length - 1] = currentMessages;
      setChatHistory(updatedChatHistory);
    }
  }, [currentMessages]);

  // Handles the selection of a prompt and sends it as a message
  const handlePrompt = (promptText) => {
    const msg: Message = {
      id: crypto.randomUUID(), // Generates a unique ID for the message
      content: promptText, // Content of the prompt
      role: "user", // Indicates the message is from the user
    };
    append(msg); // Adds the message to the chat
    if (!initialPromptSubmitted) {
      setChatHistory([...chatHistory, [msg]]);
      setInitialPromptSubmitted(true);
    }
  };

  // Handles form submission when the user sends a message
  const handleFormSubmit = (e) => {
    e.preventDefault(); // Prevents the default form submission behavior
    if (input.trim()) {
      const newMessage: Message = {
        id: crypto.randomUUID(),
        content: input,
        role: "user",
      };
      append(newMessage); // Adds the user's input as a new message
      if (!initialPromptSubmitted) {
        setChatHistory([...chatHistory, [newMessage]]);
        setInitialPromptSubmitted(true);
      }
      handleInputChange({ target: { value: "" } } as React.ChangeEvent<HTMLInputElement>); // Clears the input field
    }
  };

  // Toggles the visibility of the sidebar
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Loads a selected chat session from the history into the currentMessages state
  const loadChat = (index) => {
    const selectedChat = chatHistory[index];
    setCurrentMessages(selectedChat);
    if (isSidebarOpen) {
      setIsSidebarOpen(false);
    }
  };

  // Starts a new chat session by resetting relevant states
  const startNewChat = () => {
    setInitialPromptSubmitted(false);
    window.location.reload(); // Refreshes the page to clear the current session
  };

  // Deletes a specific chat session from chatHistory and updates localStorage
  const deleteChat = (index) => {
    const updatedChatHistory = chatHistory.filter((_, i) => i !== index);
    setChatHistory(updatedChatHistory);
    localStorage.setItem("chatHistory", JSON.stringify(updatedChatHistory));
  };

  // Determines if there are no messages in the current session
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