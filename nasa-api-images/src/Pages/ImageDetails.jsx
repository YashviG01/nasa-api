import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
// import axios from 'axios';
function ImageDetails() {
  const params = useParams(); 
  console.log(params);
  const id = params.id;
  const [imageDetails, setImageDetails] = useState({});
  console.log(imageDetails);
  const [loading, setloading] = useState(false);

  //const apikey = "2XkYGnwF9RPukNu1YZoGkh55ZiEamvyXRcJvITF0";

  const fetchImageDetails = function () {
    setloading(true);

    new Promise(function (resolve, reject) {
      fetch(`https://images-api.nasa.gov/search?nasa_id=${id}`)
        .then(function (response) {
          if (response.ok) {
            resolve(response.json());
          } else {
            reject("Network response was not ok"); 
          }
        })
        .catch(function (error) {
          reject(error);
        });
    })
      .then(function (data) {
        setImageDetails(data.collection.items[0]); 
      })
      .catch(function (err) {
        console.error("Error fetching image details:", err);
        alert("Could not fetch image details.");
      })
      .finally(function () {
        setloading(false); 
      });
  };

  useEffect(function () {
    fetchImageDetails();
  }, []);

  return (
    <div className="image-details">
      {loading ? <p>Loading might take some time!!</p> : null}

      {imageDetails?.data?.[0] && (
        <>
          <h2>{imageDetails.data[0].title}</h2>
          <p>{imageDetails.data[0].description}</p>
          <p><strong>Photographer:</strong> {imageDetails.data[0].photographer || "N/A"}</p>
          <p><strong>Date Created:</strong> {imageDetails.data[0].date_created}</p>
          
          {imageDetails?.links?.[0]?.href && (
            <img src={imageDetails.links[0].href} alt={imageDetails.data[0].title} />
          )}
        </>
      )}
    </div>
   
  );
}

export default ImageDetails;
