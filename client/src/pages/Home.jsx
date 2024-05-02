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
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching name and surname:", error);
        setIsLoading(false);
      });
  }, []);

  return (
    <div>
      {isLoading ? (
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      ) : (
        <h1>Welcome, {nameSurname}</h1>
      )}
    </div>
  );
}

export default HomePage;
