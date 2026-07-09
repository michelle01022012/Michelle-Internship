import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import AOS from 'aos';
import 'aos/dist/aos.css'; 

// --- Custom Countdown Timer Component ---
const CountdownTimer = ({ expiryDate }) => {
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    if (!expiryDate) return;

    const calculateTime = () => {
      const difference = new Date(expiryDate).getTime() - new Date().getTime();
      
      if (difference <= 0) {
        setTimeLeft("Expired");
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

// Custom Left Arrow Component
const PreviousArrow = (props) => {
  const { className, style, onClick } = props;
  return (
    <button
      className={className} 
      style={{ 
        ...style, 
        display: "flex", 
        alignItems: "center",
        justifyContent: "center",
        left: "-35px", 
        zIndex: 5,
        width: "40px",
        height: "40px",
        background: "transparent",
        border: "none",
        cursor: "pointer"
      }}
      onClick={onClick}
      aria-label="Previous slide"
    >
      <i 
        className="fa fa-chevron-left" 
        style={{ color: "#000000", fontSize: "24px", fontWeight: "bold" }}
      ></i>
      <style>{`.slick-prev::before { display: none !important; }`}</style>
    </button>
  );
};

// Custom Right Arrow Component
const NextArrow = (props) => {
  const { className, style, onClick } = props;
  return (
    <button
      className={className}
      style={{ 
        ...style, 
        display: "flex", 
        alignItems: "center",
        justifyContent: "center",
        right: "-35px", 
        zIndex: 5,
        width: "40px",
        height: "40px",
        background: "transparent",
        border: "none",
        cursor: "pointer"
      }}
      onClick={onClick}
      aria-label="Next slide"
    >
      <i 
        className="fa fa-chevron-right" 
        style={{ color: "#000000", fontSize: "24px", fontWeight: "bold" }}
      ></i>
      <style>{`.slick-next::before { display: none !important; }`}</style>
    </button>
  );
};


// --- Main Component ---
const NewItems = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // 1. Initialize AOS instance on component mount
  useEffect(() => {
    AOS.init({
      duration: 1000, 
      once: true,     
    });
  }, []);

  // 2. Force layout recalculation once async data arrives and items render
  useEffect(() => {
    if (!loading && items.length > 0) {
      AOS.refresh();
    }
  }, [loading, items]);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const { data } = await axios.get(
          "https://us-central1-nft-cloud-functions.cloudfunctions.net/newItems"
        );
        setItems(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error fetching NFT items:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchItems();
  }, []);

  // Base slider settings schema
  const baseSettings = {
    dots: true,
    speed: 500,
    slidesToScroll: 1,
    prevArrow: <PreviousArrow />, 
    nextArrow: <NextArrow />, 
  };
  const sliderSettings = {
    ...baseSettings,
    slidesToShow: 4,  
    responsive: [
      {
        breakpoint: 1024,
        settings: { slidesToShow: 3, slidesToScroll: 1 }
      },
      {
        breakpoint: 768,
        settings: { slidesToShow: 2, slidesToScroll: 1 }
      },
      {
        breakpoint: 576,
        settings: { slidesToShow: 1, slidesToScroll: 1 }
      }
    ]
  };

  return (
    <section id="section-items" className="no-bottom">
      <div className="container">
        <div className="row">
          <div className="col-lg-12">
            <div className="text-center">
              <h2>New Items</h2>
              <div className="small-border bg-color-2"></div>
            </div>
          </div>

          {loading ? (
            // --- Skeleton Loading State (4 Static placeholder items) ---
            new Array(4).fill(0).map((_, index) => (
              <div className="col-lg-3 col-md-6 col-sm-6 col-xs-12" key={index}>
                <div className="nft__item story-skeleton">
                  <div className="author_list_pp">
                    <div className="skeleton-avatar" style={{ width: 50, height: 50, borderRadius: "50%", background: "#ddd" }}></div>
                  </div>
                  <div className="nft__item_wrap">
                    <div className="skeleton-image" style={{ width: "100%", height: 200, background: "#ddd", borderRadius: 8 }}></div>
                  </div>
                  <div className="nft__item_info" style={{ marginTop: 15 }}>
                    <div className="skeleton-title" style={{ width: "60%", height: 20, background: "#ddd", marginBottom: 10 }}></div>
                    <div className="skeleton-price" style={{ width: "40%", height: 15, background: "#ddd" }}></div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            // --- Active Carousel State with Pure Arrow Elements ---
            <div className="col-lg-12" style={{ position: "relative", padding: "0 40px" }}>
              <Slider {...sliderSettings}>
                {items.map((item) => (
                  // 3. Applied data-aos attribute directly to the card container
                  <div className="padding-slider-item" key={item.id} style={{ padding: "0 10px" }} data-aos="fade-left">
                    <div className="nft__item" style={{ margin: "0 5px" }}>
                      <div className="author_list_pp">
                        <Link to={`/author/${item.authorId}`} data-bs-toggle="tooltip" title={`Creator: ${item.title}`}>
                          <img className="lazy" src={item.authorImage} alt="Author" />
                          <i className="fa fa-check"></i>
                        </Link>
                      </div>
                      
                      {item.expiryDate && <CountdownTimer expiryDate={item.expiryDate} />}

                      <div className="nft__item_wrap">
                        <div className="nft__item_extra">
                          <div className="nft__item_buttons">
                            <button>Buy Now</button>
                            <div className="nft__item_share">
                              <h4>Share</h4>
                              <a href="https://www.facebook.com/" target="_blank" rel="noreferrer">
                               <i className="fa fa-facebook fa-lg"></i>
                              </a>

                              <a href="https://twitter.com/" target="_blank" rel="noreferrer">
                                <i className="fa fa-twitter fa-lg"></i>
                              </a>

<                           a href="mailto:?subject=Check%20out%20this%20NFT">
                               <i className="fa fa-envelope fa-lg"></i>
                            </a>
                            </div>
                          </div>
                        </div>
                        <Link to={`/item-details/${item.nftId}`}>
                          <img src={item.nftImage} className="lazy nft__item_preview" alt={item.title} />
                        </Link>
                      </div>

                      <div className="nft__item_info">
                        <Link to={`/item-details/${item.nftId}`}>
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
                ))}
              </Slider>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default NewItems;
