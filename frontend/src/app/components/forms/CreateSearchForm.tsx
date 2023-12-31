import { InputContainerSearching, InputField,  SearchResultStyling } from "../../utils/styles"
import "./styles.css"
import { useDispatch } from "react-redux"
import { useForm } from "react-hook-form"
import { CreateConversationParams, UsersTypes} from "../../utils/types"
import { AppDispatch } from "../../store"
import { useEffect, useState } from "react"



export const CreateSearchForm = () => {
        const {register, handleSubmit, formState: { errors }} = useForm<CreateConversationParams>();
        const dispatch = useDispatch<AppDispatch>();

        const onSubmit = async  (data : CreateConversationParams) => {
          


        }

        const [searchQuery, setSearchQuery] = useState("");
        const [searchResults, setSearchResults] = useState<UsersTypes[]>([]);
    
        useEffect(() => {
            
            const fetchSearchResults = async () => {
                try {
                    const response = await fetch(`http://10.11.6.4:8000/user/search`, {
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
    
            if (searchQuery.trim() !== "") {
                fetchSearchResults();
            } else {
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