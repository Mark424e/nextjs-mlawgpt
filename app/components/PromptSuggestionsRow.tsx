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
    "Hvordan kan jeg beskytte min virksomhed mod retssager?",
    "Hvad er forskellen på civilret og strafferet?",
    "Hvordan laver jeg en lejekontrakt?",
    "Hvad skal jeg gøre, hvis jeg bliver udsat for diskrimination?",
    "Hvordan håndterer man en skilsmisse juridisk?",
    "Hvilke krav er der for at oprette et testamente?",
    "Hvad er arveafgift, og hvordan beregnes det?",
    "Hvordan kan jeg få erstatning for en trafikulykke?",
    "Hvad gør jeg, hvis jeg bliver anklaget for økonomisk kriminalitet?",
    "Hvordan beskytter jeg min ophavsret?",
    "Hvad betyder det at være i gældssanering?",
    "Hvilke regler gælder for arbejdsskader?",
    "Hvordan laver jeg en virksomhedsaftale?",
    "Hvordan fungerer reglerne for international arv?",
    "Hvordan ansøger jeg om fri proces i en retssag?",
  ];

  const [shuffledPrompts, setShuffledPrompts] = useState([]);
  const [numPrompts, setNumPrompts] = useState(6);

  const shuffleArray = (array) => {
    return array
      .map((item) => ({ item, sort: Math.random() }))
      .sort((a, b) => a.sort - b.sort)
      .map(({ item }) => item);
  };

  useEffect(() => {
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
    <div className="w-full grid sm:grid-cols-2 lg:grid-cols-3">
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
