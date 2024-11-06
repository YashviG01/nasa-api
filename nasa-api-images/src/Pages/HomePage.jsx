import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function HomePage() {
  const [images, setimages] = useState([]); // empty array
  const [query, setquery] = useState('');//empty string
  const [loading, setloading] = useState(false); // boolean value
  const [currentpg, setCurrentpg] = useState(1);//keep the deafult no. of pg 1
  const perpg = 6;

  // Fetch all types of images initially
  useEffect(() => {
    fetchImages('');
  }, []);//runs once

  // Function to fetch images
  function fetchImages(searchTerm) {
    setloading(true);

    new Promise(function(resolve, reject) {
      fetch(`https://images-api.nasa.gov/search?q=${searchTerm}&media_type=image`)
        .then(function(response) {
          if (response.ok) {
            resolve(response.json());
          } else {
            reject("Network response was not ok");
          }
        })
        .catch(function(error) {
          reject(error);
        });
    })
      .then(function(data) {
        setimages(data.collection.items); // Handle resolved data
      })
      .catch(function(error) {
        console.error("Error fetching images:", error);
        alert('Could not fetch images. Please try again.');
      })
      .finally(function() {
        setloading(false); //we must ensure loading state is reset in any case otherwise next time it might not show
      });
  }

  // Debounce logic for search query
  useEffect(() => {
    const debounceTimeout = setTimeout(() => {
      fetchImages(query);
    }, 3000);

    // Cleanup the timeout on component unmount or when query changes
    return () => clearTimeout(debounceTimeout);
  }, [query]);

  function next() {
    if (currentpg * perpg < images.length) {
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
  const currentImages = images.slice(first, last);

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
            <p>{image.data[0].title}</p>
            <img src={image.links[0].href} />
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
