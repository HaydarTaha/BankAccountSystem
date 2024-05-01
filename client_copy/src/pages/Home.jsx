import React, { useState, useEffect } from "react";
import { getNameSurname } from "../service/User";

function HomePage() {
  const [nameSurname, setNameSurname] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const userID = document.cookie.split("=")[1];

    getNameSurname(userID)
      .then((data) => {
        setNameSurname(data.name + " " + data.surname);
        console.log(nameSurname);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching name and surname:", error);
        setIsLoading(false);
      });
  }, []);

  return (
    <div>
      <h1>Welcome, {nameSurname}</h1>
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <p>This is your home page.</p>
      )}
    </div>
  );
}

export default HomePage;