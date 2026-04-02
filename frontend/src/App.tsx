import { useState } from "react";
import { Button } from "./components/ui/button";
import "./index.css";

export function App() {

  function getPresignedUrl() {
    fetch("http://localhost:3000/api/get-url", {
      method: "GET",
      credentials: "include"
    }).then(data => {
      console.log(data)
    })
  }

  const [file, setFile] = useState("");
  return (
    <div className="container mx-auto p-8 text-center relative z-10">
      ${JSON.stringify(file)}
      <br />
      <input type="file" onChange={(e) => {
        setFile(e.target.value)
      }} />
      <Button onClick={() => {
        getPresignedUrl()
      }}>
        get url
      </Button>
    </div>
  );
}

export default App;
