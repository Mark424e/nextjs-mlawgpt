import { useState, useEffect } from "react";
import PromptSuggestionButton from "./PromptSuggestionButton";

const PromptSuggestionsRow = ({ onPromptClick }) => {
  const allPrompts = [
    "Hvem kan hjælpe med juridisk rådgivning?",
    "Hvad koster det at få en advokat?",
    "Hvor kan jeg finde information om arveret?",
    "Hvordan foregår en retssag?",
    "Hvorfor er det vigtigt at have en testamente?",
    "Hvornår skal jeg kontakte en advokat?",
    "Hvad er forskellen mellem en advokat og en jurist?",
    "Hvordan ansøger jeg om juridisk bistand?",
    "Hvad skal jeg vide om ejendomshandler?",
    "Hvilke rettigheder har jeg som lejer?",
    "Hvordan fungerer arvereglerne i Danmark?",
    "Hvad er en fremtidsfuldmagt, og hvordan opretter jeg en?",
  ];

  const [shuffledPrompts, setShuffledPrompts] = useState([]);
  const [numPrompts, setNumPrompts] = useState(6);

  // Function to shuffle an array
  const shuffleArray = (array) => {
    return array
      .map((item) => ({ item, sort: Math.random() }))
      .sort((a, b) => a.sort - b.sort)
      .map(({ item }) => item);
  };

  useEffect(() => {
    // Shuffle the prompts on component load
    setShuffledPrompts(shuffleArray(allPrompts));

    const handleResize = () => {
      if (window.innerWidth < 768) {
        setNumPrompts(4);
      } else {
        setNumPrompts(6);
      }
    };

    handleResize();

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="w-full">
      {shuffledPrompts.slice(0, numPrompts).map((prompt, index) => (
        <PromptSuggestionButton
          key={`suggestion-${index}`}
          text={prompt}
          onClick={() => onPromptClick(prompt)}
        />
      ))}
    </div>
  );
};

export default PromptSuggestionsRow;
