import React, {useState} from "react"

export default function MessageInput ({send,} : { send: (val : string) => void})
{
    const [value, setValue] = useState("");
    const [username, setUsername] = useState("")
    return (
        <div>
            <input onChange={(e) => setValue(e.target.value) }placeholder= "type your message..." value={value}/>
            <br/>
            <button type="button" onClick={() => send(value)}>Send</button>
        </div>
      );
}