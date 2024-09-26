import { useEffect, useMemo, useState } from "react";
import { List } from "../List/List";
import { Form } from "../Form/Form";
import css from "./Panel.module.css";
import { Loader } from "../Loader/Loader";
import { ErrorMessage } from "../ErrorMessage/ErrorMessage";
import { FilterButton } from "../FilterButton/FilterButton";
import { getCategoryInfo } from "../../utils/getCategoryInfo";
import { Info } from "../Info/Info";

const API_URL = "http://localhost:3000";

export function Panel() {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorText, setErrorText] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);

  useEffect(() => {
    let isCanceled = false;
    let fetchUrlEnd;
    selectedCategory
      ? (fetchUrlEnd = `?category=${selectedCategory}`)
      : (fetchUrlEnd = "");

    fetch(`${API_URL}/words${fetchUrlEnd}`)
      .then((response) => response.json())
      .then((data) => {
        if (!isCanceled) {
          setData(data);
          // NOTE: setTimeout to show the loader
          // setIsLoading(false);
          setTimeout(() => {
            setIsLoading(false);
          }, 1000);
        }
      })
      .catch((error) => console.error("BŁĄD!", error));

    return () => {
      isCanceled = true;
    };
  }, [selectedCategory]);

  const categoryInfoText = useMemo(() => {
    return getCategoryInfo(selectedCategory);
  }, [selectedCategory]);

  const addWord = (newItem) => {
    fetch(`${API_URL}/words`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newItem),
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error("Błąd podczas dodawania słowa");
        }
      })
      .then((data) => {
        if (
          selectedCategory === newItem.category ||
          selectedCategory === null
        ) {
          setData((prevState) => [...prevState, data]);
        }
      })
      .catch((error) => {
        setErrorText(error.message);
        setTimeout(() => {
          setErrorText(null);
        }, 3000);
      });
  };

  const deleteWord = (id) => {
    fetch(`${API_URL}/words/${id}`, {
      method: "DELETE",
    })
      .then((response) => {
        if (response.ok) {
          setData((prevState) => prevState.filter((word) => word.id !== id));
        } else {
          throw Error("Błąd podczas usuwania słowa");
        }
      })
      .catch((error) => {
        setErrorText(error.message);
        setTimeout(() => {
          setErrorText(null);
        }, 3000);
      });
  };

  const handleSelectCategory = (categoryName) => {
    setSelectedCategory(categoryName);
  };

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <>
          {errorText && <ErrorMessage>{errorText}</ErrorMessage>}
          <section className={css.section}>
            <Info>{categoryInfoText}</Info>
            <Form addWord={addWord} />
            <div className={css.filters}>
              <FilterButton
                onClick={() => handleSelectCategory(null)}
                active={selectedCategory === null}
              >
                Wszystkie
              </FilterButton>
              <FilterButton
                onClick={() => handleSelectCategory("noun")}
                active={selectedCategory === "noun"}
              >
                Rzeczowniki
              </FilterButton>
              <FilterButton
                onClick={() => handleSelectCategory("verb")}
                active={selectedCategory === "verb"}
              >
                Czasowniki
              </FilterButton>
            </div>
            <List data={data} deleteWord={deleteWord} />
          </section>
        </>
      )}
    </>
  );
}
