import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

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

const HotCollections = () => {
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const fetchCollections = async () => {
      try {
        const response = await axios.get(
          "https://us-central1-nft-cloud-functions.cloudfunctions.net/hotCollections"
        );
        if (isMounted) {
          // Extra safety check: confirm API data is actually an array
          setCollections(Array.isArray(response.data) ? response.data : []);
        }
      } catch (error) {
        console.error("Error fetching hot collections:", error);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };
    fetchCollections();
    return () => { isMounted = false; };
  }, []);

  // Slider settings configuration
  const settings = {
    dots: true,
    infinite: collections.length > 4, // CRUCIAL: Disable infinite looping if there aren't enough items
    speed: 500,
    slidesToShow: Math.min(4, collections.length > 0 ? collections.length : 1), // Avoid setting to 4 if array has fewer elements
    slidesToScroll: 1,
    arrows: collections.length > 1, // Only render arrow loops if there is data to traverse
    prevArrow: <PreviousArrow />, 
    nextArrow: <NextArrow />, 
    responsive: [
      {
        breakpoint: 1024, 
        settings: {
          slidesToShow: Math.min(3, collections.length > 0 ? collections.length : 1),
          slidesToScroll: 1,
        }
      },
      {
        breakpoint: 768, 
        settings: {
          slidesToShow: Math.min(2, collections.length > 0 ? collections.length : 1),
          slidesToScroll: 1
        }
      },
      {
        breakpoint: 480, 
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1
        }
      }
    ]
  };

  if (loading) {
    return (
      <section id="section-collections" className="no-bottom">
        <div className="container">
          <div className="row">
            <div className="col-lg-12 text-center">
              <h2>Loading Hot Collections...</h2>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // CRUCIAL SAFETY OVERRIDE: Prevent mounting react-slick with 0 items
  if (!collections || collections.length === 0) {
    return (
      <section id="section-collections" className="no-bottom">
        <div className="container">
          <div className="row">
            <div className="col-lg-12 text-center">
              <h2>Hot Collections</h2>
              <div className="small-border bg-color-2"></div>
              <p style={{ marginTop: "20px", color: "#777" }}>No collections available at the moment.</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="section-collections" className="no-bottom">
      <div className="container">
        <div className="row">
          <div className="col-lg-12">
            <div className="text-center">
              <h2>Hot Collections</h2>
              <div className="small-border bg-color-2"></div>
            </div>
          </div>
          <div className="col-lg-12" style={{ padding: "0 40px" }}> {/* Left/Right padding protects arrows from viewport clipping */}
            <Slider {...settings}>
              {collections.map((coll) => (
                <div key={coll.id || coll.nftId} className="px-2">
                  <div className="nft_coll">
                    <div className="nft_wrap">
                      <Link to={`/item-details/${coll.nftId}`}>
                        <img src={coll.nftImage} className="lazy img-fluid" alt={coll.title || "NFT Image"} />
                      </Link>
                    </div>
                    <div className="nft_coll_pp">
                      <Link to={`/author/${coll.authorId}`}>
                        <img className="lazy pp-coll" src={coll.authorImage} alt="" />
                      </Link>
                      <i className="fa fa-check"></i>
                    </div>
                    <div className="nft_coll_info">
                      <Link to="/explore">
                        <h4>{coll.title}</h4>
                      </Link>
                      <span>ERC-{coll.code}</span>
                    </div>
                  </div>
                </div>
              ))}
            </Slider>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HotCollections;
