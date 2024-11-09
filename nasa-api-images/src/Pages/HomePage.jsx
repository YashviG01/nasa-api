import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

function HomePage() {
  const [filteredImages, setFilteredImages] = useState([]); 
  const [images, setimages] = useState([]); 
  const [query, setquery] = useState('');
  const [loading, setloading] = useState(false); 
  const [currentpg, setCurrentpg] = useState(1);
  const perpg = 6;

  useEffect(() => {
    fetchImages('');
  }, []);

  
  function fetchImages(searchTerm) {
    setloading(true);

    new Promise(function(resolve, reject) {
      fetch(`https://images-api.nasa.gov/search?q=${searchTerm}&media_type=image`)
        .then(function(response) {
          if (response.ok) {
            resolve(response.json());
            console.log(response.json())
          } else {
            reject("Network response was not ok");
          }
        })
        .catch(function(error) {
          reject(error);
        });
    })
      .then(function(data) {
        setimages(data.collection.items); 
      })
      .catch(function(error) {
        console.error("Error fetching images:", error);
        alert('Could not fetch images. Please try again.');
      })
      .finally(function() {
        setloading(false); 
      });
  }

  useEffect(() => {
    const debounceTimeout = setTimeout(() => {
      const filtered = images.filter(image => 
        image.data[0].title.toLowerCase().includes(query.toLowerCase())//to check if query included or not
      );
      setFilteredImages(filtered);
    }, 1000);//after 1s 

    return () => clearTimeout(debounceTimeout);
  }, [query, images]);




  function next() {
    if (currentpg * perpg < filteredImages.length) {
      setCurrentpg(currentpg + 1);
    }
  }

  function prev() {
    if (currentpg > 1) {
      setCurrentpg(currentpg - 1);
    }
  }

  const last = currentpg * perpg;
  const first = last - perpg;
  const currentImages = filteredImages.slice(first, last);

  // const apikey = "2XkYGnwF9RPukNu1YZoGkh55ZiEamvyXRcJvITF0";

  const get = async () => {
    try{
      const response = await axios.get(`https://image-api.nasa.gov/search`,{
        params: {
          // "api_key":apikey,
          "q": "black hole"
        }
      })
      console.log(response.data);
    } catch(error) {
      console.error(error);
    }
  }

  useEffect(() => {
    get();
  },[])

  return (
    <>
      <input
        type="text"
        placeholder="Enter"
        value={query}
        onChange={(e) => setquery(e.target.value)}
      />

      {loading ? <p>Loading might take some time!!</p> : null}

      <div className="image-gallery">
        {currentImages.map((image) => (
          <Link
            to={"/image/" + image.data[0].nasa_id}
            key={image.data[0].nasa_id}
            className="image-card"
          >
            <div className="card-inner">
              
               <p>{image.data[0].title}</p>
         
         <img src={image.links[0].href} />
         <div className="card-back">
               <p><strong>Date Taken:</strong> {new Date(image.data[0].date_created).toLocaleDateString()}</p>
             </div>
                          </div>

          </Link>
        ))}
      </div>

      <div className="pagination">
        <button onClick={prev}>Previous</button>
        <span>Page {currentpg}</span>
        <button onClick={next}>Next</button>
      </div>
    </>
  );
}

export default HomePage;
