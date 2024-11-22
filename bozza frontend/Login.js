import React, {useState} from "react"

export default function Login(probs) {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [message, setMessage] = useState("")

    const onSubmit = (e) => {
        e.preventDefault();
        let user = {email: email, password: password};


        fetch("http://localhost:8080/api/auth/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(user),
        })
            .then((response) => response.json())
            .then((data) => {
                setMessage("La password è esatta! Benvenuto :) ");
                console.log(data);
                console.log("qui entro sempre!")
            })
            .catch((error) =>{
                setMessage(error.message);
                //console.log("Something went wrong");
            });
    };
    return(
        <form onSubmit={onSubmit}>
            <div className="Login">
                Login to find the secret
                <div className="InputBox">
                    <label>Email:</label>
                    <input
                        type="email"
                        name="email"
                        onChange={(event) => setEmail(event.target.value)}
                        />
                </div>
                <div className="InputBox">
                    <label>Password:</label>
                    <input
                    type="password"
                    name="password"
                    onChange={(event) => setPassword(event.target.value)}
                    />
                </div>
                <button type="submit">Login</button>
                {message && <div className="Message">{message}</div>}
            </div>
        </form>
    );
    }