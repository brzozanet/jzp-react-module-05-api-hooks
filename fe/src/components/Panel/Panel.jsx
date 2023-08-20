import { useState, useEffect } from "react";
import styles from "./Panel.module.css";
import { List } from "../List/List";
import { Form } from "../Form/Form";
import { ErrorMessage } from "../ErrorMessage/ErrorMessage";
import { FilterButton } from "../FilterButton/FilterButton";

const url = "http://localhost:3000/words";

export function Panel() {
    const [data, setData] = useState([]);
    const [error, setError] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        let isCanceled = false;
        console.log(`Efekt! Wartość selectedCategory: ${selectedCategory}`);

        const params = selectedCategory ? `?category=${selectedCategory}` : "";
        fetch(`${url}${params}`)
            .then((res) => res.json())
            .then((res) => {
                if (!isCanceled) {
                    setIsLoading(false);
                    setData(res);
                    console.log("Aktualizacja danych");
                }
            });

        return () => {
            isCanceled = true;
            console.log(
                `Cleanup! Wartość selectedCategory: ${selectedCategory}`
            );
        };
    }, [selectedCategory]);

    function handleFormSubmit(formData) {
        fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(formData),
        })
            .then((res) => res.json())
            .then((res) => {
                if (!selectedCategory || selectedCategory === res.category) {
                    setData((prevData) => [...prevData, res]);
                }
            });
    }

    function handleDeleteItem(id) {
        fetch(`${url}/${id}`, { method: "DELETE" })
            .then((res) => {
                if (res.ok) {
                    setData((prevData) =>
                        prevData.filter((item) => item.id !== id)
                    );
                } else {
                    throw new Error("Błąd podczas usuwania! Spróbuj ponownie.");
                }
            })
            .catch((error) => {
                setError(error.message);
                setTimeout(() => {
                    setError(null);
                }, 3000);
            });
    }

    function handleFilterClick(category) {
        setSelectedCategory(category);
    }

    if (isLoading) {
        return <p>Ładowanie...</p>;
    }

    return (
        <>
            {error && <ErrorMessage>{error}</ErrorMessage>}

            <section className={styles.section}>
                <Form onFormSubmit={handleFormSubmit} />
                <div className={styles.filters}>
                    <FilterButton
                        active={selectedCategory === null}
                        onClick={() => handleFilterClick(null)}
                    >
                        Wszystkie
                    </FilterButton>
                    <FilterButton
                        active={selectedCategory === "noun"}
                        onClick={() => handleFilterClick("noun")}
                    >
                        Rzeczowniki
                    </FilterButton>
                    <FilterButton
                        active={selectedCategory === "verb"}
                        onClick={() => handleFilterClick("verb")}
                    >
                        Czasowniki
                    </FilterButton>
                </div>
                <List data={data} onDeleteItem={handleDeleteItem} />
            </section>
        </>
    );
}
