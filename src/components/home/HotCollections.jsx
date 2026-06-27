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
      className={`${className} custom-slick-arrow prev-arrow`}
      style={{ ...style, display: "block", left: "-25px", zIndex: 1 }}
      onClick={onClick}
      aria-label="Previous slide"
    >
      <i className="fa fa-chevron-left"></i>
    </button>
  );
};

// Custom Right Arrow Component
const NextArrow = (props) => {
  const { className, style, onClick } = props;
  return (
    <button
      className={`${className} custom-slick-arrow next-arrow`}
      style={{ ...style, display: "block", right: "-25px", zIndex: 1 }}
      onClick={onClick}
      aria-label="Next slide"
    >
      <i className="fa fa-chevron-right"></i>
    </button>
  );
};

const HotCollections = () => {
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCollections = async () => {
      try {
        const response = await axios.get(
          "https://us-central1-nft-cloud-functions.cloudfunctions.net/hotCollections"
        );
        setCollections(response.data);
      } catch (error) {
        console.error("Error fetching hot collections:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCollections();
  }, []);

  // Slider settings configuration
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 4, 
    slidesToScroll: 1,
    arrows: true, // Ensures arrow rendering is globally active
    prevArrow: <PreviousArrow />, // Registers custom left arrow
    nextArrow: <NextArrow />, // Registers custom right arrow
    responsive: [
      {
        breakpoint: 1024, 
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
        }
      },
      {
        breakpoint: 768, 
        settings: {
          slidesToShow: 2,
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
            <div className="text-center">
              <h2>Loading Hot Collections...</h2>
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
          <div className="col-lg-12">
            <Slider {...settings}>
              {collections.map((coll) => (
                <div key={coll.id} className="px-2">
                  <div className="nft_coll">
                    <div className="nft_wrap">
                      <Link to={`/item-details/${coll.nftId}`}>
                        <img src={coll.nftImage} className="lazy img-fluid alt={coll.title}" />
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
 