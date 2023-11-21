import { UsersTypes } from "@/app/utils/types";
import { useState, useEffect } from "react";
import { MdSearch } from "react-icons/md";
import styles from "./ConversationSearch.module.css"; 

const ConversationSearch = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState<UsersTypes[]>([]);

    useEffect(() => {
        // Define a function to fetch search results
        const fetchSearchResults = async () => {
            try {
                const response = await fetch(`http://localhost:8000/user/search`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ displayName: searchQuery }),
                });

                if (response.ok) {
                    const data = await response.json();
                    console.log("searching", data);
                    setSearchResults(data);
                }
            } catch (error) {
                console.error("Error fetching search results:", error);
            }
        };

        // Fetch search results when searchQuery changes
        if (searchQuery.trim() !== "") {
            fetchSearchResults();
        } else {
            // Clear search results if the searchQuery is empty
            console.log("here nop");
            setSearchResults([]);
        }

        console.log("searchingelem-->", searchResults);
    }, [searchQuery]);

    return (
        <div className={`search-container ${styles.searchContainer}`}>
            <input
                className={`rounded-l-lg text-black focus:outline-none bg-[#D9D9D9] bg-opacity-20 p-3 ${styles.input}`}
                placeholder="Search by display name"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
            />
            <div className="text-black">
                {searchResults.map((user) => (
                    <div key={user.id} className={styles.resultItem}>
                        {user.display_name}
                    </div>
                ))}
            </div>
        </div>
    );
};



export default ConversationSearch;