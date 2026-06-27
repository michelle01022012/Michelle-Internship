import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

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
    slidesToShow: 4, // Shows 4 items at the start
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1024, // Desktop/Tablet landscape
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
        }
      },
      {
        breakpoint: 768, // Tablet portrait
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1
        }
      },
      {
        breakpoint: 480, // Mobile phone
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
            {/* Wrapped the mapped array inside the Slider component */}
            <Slider {...settings}>
              {collections.map((coll) => (
                <div key={coll.id} className="px-2"> {/* Added padding utility for spacing between items */}
                  <div className="nft_coll">
                    <div className="nft_wrap">
                      <Link to={`/item-details/${coll.nftId}`}>
                        <img src={coll.nftImage} className="lazy img-fluid" alt={coll.title} />
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
