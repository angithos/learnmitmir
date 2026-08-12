
import { useState } from "react";
import { db, auth } from "../firebase/firebaseconfig";

type Gender = "der" | "die" | "das";

interface DictionaryData {
    entries: Entry[];
}

interface Entry {
    partOfSpeech: string;
    senses: Sense[];
}

interface Sense {
    definition: string;
    tags: string[];
}

interface VocabularyWord {
    word: string;
    gender?: Gender;
    partofspeech?: string;
    definition?: string;
}

interface VocabData {
    article?: Gender;
    POS: string;
    defintion: string;
}

export default function Vocabulary() {
    const [word, setWord] = useState("");
    const [error, setError] = useState<string | null>(null);

    async function handleSearch(search: string) {
        setError(null);

        async function fetchData(
            search: string
        ): Promise<DictionaryData | null> {
            try {
                const trimmedWord = search.trim();

                if (trimmedWord === "") {
                    console.log("empty word");
                    return null;
                }

                const res = await fetch(
                    `https://freedictionaryapi.com/api/v1/entries/de/${trimmedWord}`
                );

                if (!res.ok) {
                    return null;
                }

                const data: DictionaryData = await res.json();

                return data;

            } catch (error) {
                console.log(error);
                return null;
            }
        }

        function gatherWordInfo(
            data: DictionaryData
        ): VocabData | null {

            if (!data.entries.length) {
                console.log("invalid word");
                return null;
            }

            const tags = data.entries[0].senses[0].tags;
            const POS = data.entries[0].partOfSpeech;

            let article: Gender | undefined;

            if (tags.includes("plural")) {
                article = "die";
            }
            else if (tags.includes("masculine")) {
                article = "der";
            }
            else if (tags.includes("feminine")) {
                article = "die";
            }
            else if (tags.includes("neuter")) {
                article = "das";
            }

            const definition = data.entries[0].senses[0].definition;

            return {
                article,
                POS,
                defintion: definition
            };
        }

        function createVocabulary(
            vocabData: VocabData,
            searchedWord: string
        ) {
            const vocabulary: VocabularyWord = {
                word: searchedWord,
                gender: vocabData.article,
                partofspeech: vocabData.POS,
                definition: vocabData.defintion
            };

            return vocabulary;
        }

        let data = await fetchData(search);

        // First request failed
        if (data === null) {
            console.log("Word not found");
            return;
        }

        // API responded but returned no entries
        if (!data.entries.length) {
            const lower_word=search.toLowerCase() //edge case Full captial

            const firstLetter = lower_word[0].toUpperCase(); //edge case First letter small
            const newWord = lower_word.replace(lower_word[0], firstLetter);

            data = await fetchData(newWord);

            // Capitalized version also failed
            if (data === null || !data.entries.length) {
                console.log("Word not found");
                return;
            }

            search = newWord;
        }

        const vocabData = gatherWordInfo(data);

        if (vocabData === null) {
            console.log("Invalid word");
            return;
        }

        const vocabulary = createVocabulary(vocabData, search);

        console.log(vocabulary);
    }

    return (
        <div>
            <h1>Welcome back</h1>

            <input
                value={word}
                onChange={(e) => setWord(e.target.value)}
            />

            <button onClick={() => handleSearch(word)}>
                Add a new word
            </button>

            {error && <p>{error}</p>}
        </div>
    );
}

