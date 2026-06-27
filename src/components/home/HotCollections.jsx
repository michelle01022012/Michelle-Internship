import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Slider from "react-slick";

const HotCollections = () => {
  // 1. Create a state variable to hold the API data
  const [collections, setCollections] = useState([]);
  
  // 2. Create a loading state to handle network lag
  const [loading, setLoading] = useState(true);

  // 3. Fetch data from the API when the component mounts
  useEffect(() => {
    const fetchCollections = async () => {
      try {
        const response = await axios.get(
          "https://us-central1-nft-cloud-functions.cloudfunctions.net/hotCollections"
        );
        setCollections(response.data);
      } catch (error) {
        console.error("Error fetching hot collections: ", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCollections();
  }, []);

  // 4. Show a loading skeleton or text while waiting for data
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
          
          {/* 5. Map over the live API data instead of a hardcoded array */}
          {collections.map((coll) => (
            <div className="col-lg-3 col-md-6 col-sm-6 col-xs-12" key={coll.id}>
              <div className="nft_coll">
                <div className="nft_wrap">
                  {/* Dynamic link to details page using collection ID */}
                  <Link to={`/item-details/${coll.nftId}`}>
                    <img
                      src={coll.nftImage}
                      className="lazy img-fluid"
                      alt={coll.title}
                    />
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
        </div>
      </div>
    </section>
  );
};

export default HotCollections;
