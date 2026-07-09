import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import AOS from 'aos';
import 'aos/dist/aos.css'; 

// REUSABLE COUNTDOWN TIMER COMPONENT
const CountdownTimer = ({ expiryDate }) => {
  const [timeLeft, setTimeLeft] = useState('');

  useEffect(() => {
    if (!expiryDate) return;

    const calculateTime = () => {
      const difference = new Date(expiryDate) - new Date();

      if (difference <= 0) {
        setTimeLeft('Expired');
        return;
      }

      const hours = Math.floor(difference / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeLeft(`${hours}h ${minutes}m ${seconds}s`);
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);

    return () => clearInterval(interval);
  }, [expiryDate]);

  return timeLeft ? <div className="de_countdown">{timeLeft}</div> : null;
};

// SKELETON LOADING STATE COMPONENT (UPDATED FOR 4 COLUMNS)
const SkeletonCard = () => (
  <div className="d-item col-lg-3 col-md-6 col-sm-6 col-xs-12" style={{ display: 'block' }}>
    <div className="nft__item" style={{ minHeight: '400px' }}>
      <div className="author_list_pp">
        <div className="skeleton-animation" style={{ width: '50px', height: '50px', borderRadius: '50%', background: '#eee' }}></div>
      </div>
      <div className="nft__item_wrap">
        <div className="skeleton-animation" style={{ width: '100%', height: '200px', background: '#eee', borderRadius: '8px' }}></div>
      </div>
      <div className="nft__item_info" style={{ marginTop: '15px' }}>
        <div className="skeleton-animation" style={{ width: '60%', height: '20px', background: '#eee', marginBottom: '10px' }}></div>
        <div className="skeleton-animation" style={{ width: '40%', height: '15px', background: '#eee' }}></div>
      </div>
    </div>
  </div>
);

// MAIN EXPLORE ITEMS COMPONENT
const ExploreItems = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');
  const [visibleCount, setVisibleCount] = useState(8); // Defaults to 8 items (exactly 2 complete rows of 4)

  // Initialize AOS animation
  useEffect(() => {
    AOS.init({
      duration: 1000, 
      once: true,     
    });
  }, []);

  // Fetch data when component mounts or API filter changes
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        let url = "https://us-central1-nft-cloud-functions.cloudfunctions.net/explore";
        if (filter) {
          url += `?filter=${filter}`;
        }
        const response = await axios.get(url);
        setItems(response.data);
      } catch (error) {
        console.error('Error fetching NFT data: ', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [filter]);

  const loadMoreItems = (e) => {
    e.preventDefault();
    setVisibleCount((prevCount) => prevCount + 4); // Adds exactly 1 new row of 4 cards on click
  };

  return (
    <div data-aos="fade-up">
      <div>
        <select
          id="filter-items"
          value={filter}
          onChange={(e) => {
            setFilter(e.target.value);
            setVisibleCount(8); 
          }}
        >
          <option value="">Default</option>
          <option value="price_low_to_high">Price, Low to High</option>
          <option value="price_high_to_low">Price, High to Low</option>
          <option value="likes_high_to_low">Most liked</option>
        </select>
      </div>

      {/* Wrapping layout in a Bootstrap row wrapper to guarantee correct horizontal column alignments */}
      <div className="row">
        {loading ? (
          // Display 8 Skeleton Cards while loading
          new Array(8).fill(0).map((_, index) => <SkeletonCard key={index} />)
        ) : (
          // Render dynamic API data based on visible count slice (UPDATED FOR 4 COLUMNS)
          items.slice(0, visibleCount).map((item) => (
            <div
              key={item.id || item.nftId}
              className="d-item col-lg-3 col-md-6 col-sm-6 col-xs-12"
              style={{ display: 'block', backgroundSize: 'cover' }}
            >
              <div className="nft__item">
                <div className="author_list_pp">
                  <Link to={`/author/${item.authorId || ''}`} data-bs-toggle="tooltip" data-bs-placement="top">
                    <img className="lazy" src={item.authorImage} alt="Author" />
                    <i className="fa fa-check"></i>
                  </Link>
                </div>
                
                {/* Dynamic Resizable Countdown */}
                <CountdownTimer expiryDate={item.expiryDate} />

                <div className="nft__item_wrap">
                  <div className="nft__item_extra">
                    <div className="nft__item_buttons">
                      <button>Buy Now</button>
                      <div className="nft__item_share">
                        <h4>Share</h4>
                        <a href="https://facebook.com" target="_blank" rel="noreferrer">
                          <i className="fa fa-facebook fa-lg"></i>
                        </a>
                        <a href="https://twitter.com" target="_blank" rel="noreferrer">
                          <i className="fa fa-twitter fa-lg"></i>
                        </a>
                        <a href={`mailto:?subject=Check out this NFT`}>
                          <i className="fa fa-envelope fa-lg"></i>
                        </a>
                      </div>
                    </div>
                  </div>
                  <Link to={`/item-details/${item.nftId || ''}`}>
                    <img src={item.nftImage} className="lazy nft__item_preview" alt="NFT Preview" />
                  </Link>
                </div>

                <div className="nft__item_info">
                  <Link to={`/item-details/${item.nftId || ''}`}>
                    <h4>{item.title}</h4>
                  </Link>
                  <div className="nft__item_price">{item.price} ETH</div>
                  <div className="nft__item_like">
                    <i className="fa fa-heart"></i>
                    <span>{item.likes}</span>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Render Load More button only if there are more items to reveal and we are not loading */}
      {!loading && visibleCount < items.length && (
        <div className="col-md-12 text-center">
          <button onClick={loadMoreItems} id="loadmore" className="btn-main lead" style={{ border: 'none', cursor: 'pointer' }}>
            Load more
          </button>
        </div>
      )}
    </div>
  );
};

export default ExploreItems;