import { useState, useCallback } from "react";
import css from "./App.module.css";
import { Panel } from "./components/Panel/Panel";
import { ErrorMessage } from "./components/ErrorMessage/ErrorMessage";

function App() {
  const [mainErrorText, setMainErrorText] = useState(null);

  const handleError = useCallback((error) => {
    setMainErrorText(error.message);
    setTimeout(() => {
      setMainErrorText(null);
    }, 3000);
  }, []);

  return (
    <main className={css.main}>
      {mainErrorText ? (
        <ErrorMessage>{mainErrorText}</ErrorMessage>
      ) : (
        <Panel onMainError={handleError} />
      )}
    </main>
  );
}

export default App;
