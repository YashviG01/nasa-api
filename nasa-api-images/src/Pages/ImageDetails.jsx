import { useState } from 'react';
import { useParams} from 'react-router-dom';
import axios from 'axios';
function ImageDetails() {
    const params = useParams();//returns an object
    const id = params.id;
      const [imageDetails, setImageDetails] = useState({});
  const [loading, setloading] = useState(false);


  const fetchImageDetails = function () {
    setloading(true);

    const apikey = "2XkYGnwF9RPukNu1YZoGkh55ZiEamvyXRcJvITF0";

    new Promise(function (resolve, reject) {

 // Use axios to fetch data with the API key
 axios.get(`https://images-api.nasa.gov/search`, {
  params: {
      nasa_id: id,
      api_key: apikey
  }
})
       // fetch(`https://images-api.nasa.gov/search?nasa_id=${id}&api_key=${apikey}`)
           
        
        
        .then(function (response) {
                if (response.ok) {
                    resolve(response.json()); 
                } else {
                    reject("Network response was not ok"); // Reject if response is not okay
                }
            })
            .catch(function (error) {
                reject(error); 
            });
    })
    .then(function (data) {
        setImageDetails(data.collection.items[0]); // Use resolved data
    })
    .catch(function (err) {
        console.error("Error fetching image details:", err);
        alert('Could not fetch image details.');
    })
    .finally(function () {
        setloading(false); // Reset loading state
    });
};

  

    fetchImageDetails();
  

   

//   if (loading) return <p>Loading might take some time</p>;

  return (

    

    <div className="imagedetails">


{loading ? <p>Loading might take some time!!</p> : null}
      <h2>{imageDetails.data[0].title}</h2>
      <img src={imageDetails.links[0].href}  />
      <p>{imageDetails.data[0].description}</p>
    </div>
  );
}

export default ImageDetails;
