import { InputContainer, InputContainerSearching, InputField, InputLabel, SearchResultStyling, TextField } from "@/app/utils/styles"
import "./styles.css"
import { Button } from "@/app/utils/styles"
import { useDispatch } from "react-redux"
import { addConversation, createConversationThunk } from "@/app/store/conversationSlice"
import { useForm } from "react-hook-form"
import { CreateConversationParams, UsersTypes, createUserParams } from "@/app/utils/types"
import { AppDispatch } from "@/app/store"
import { createConversation } from "@/app/utils/api"
import { Dispatch, FC, useEffect, useState } from "react"



export const CreateSearchForm = () => {
        const {register, handleSubmit, formState: { errors }} = useForm<CreateConversationParams>();
        const dispatch = useDispatch<AppDispatch>();

        const onSubmit = async  (data : CreateConversationParams) => {
          


        }

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
                setSearchResults([]);
            }
    
        }, [searchQuery]);
    return (
          
                <InputContainerSearching backgroundColor="#87a2c6">
                    <InputField
                            placeholder="Find your friends"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}/>

                    <SearchResultStyling>
                            {searchResults.map((user) => (
                        <div key={user.id} className="result-item">
                        {user.display_name}
                    </div>
                ))}
            </SearchResultStyling>
                    
                </InputContainerSearching>
        
           
            
    )
}