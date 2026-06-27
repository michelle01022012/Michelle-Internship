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

// Pure JSX Skeleton Item mirroring the actual card dimensions
const CollectionSkeleton = () => {
  return (
    <div className="px-2">
      {/* Dynamic keyframe injection for standard pulse animation */}
      <style>{`
        @keyframes pulse {
          0% { opacity: 0.6; }
          50% { opacity: 1; }
          100% { opacity: 0.6; }
        }
        .skeleton-pulse {
          animation: pulse 1.5s infinite ease-in-out;
          background-color: #e0e0e0;
        }
      `}</style>
      
      <div className="nft_coll" style={{ background: "#fff", border: "1px solid #e0e0e0", borderRadius: "8px", padding: "15px", position: "relative" }}>
        {/* Banner/Image wrapper block */}
        <div className="skeleton-pulse" style={{ width: "100%", height: "150px", borderRadius: "6px" }}></div>
        
        {/* Profile Avatar circle */}
        <div style={{ display: "flex", justifyContent: "center", marginTop: "-30px", position: "relative", zIndex: 2 }}>
          <div className="skeleton-pulse" style={{ width: "60px", height: "60px", borderRadius: "50%", border: "4px solid #fff" }}></div>
        </div>
        
        {/* Text information lines */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginTop: "15px" }}>
          <div className="skeleton-pulse" style={{ width: "60%", height: "16px", borderRadius: "4px", marginBottom: "8px" }}></div>
          <div className="skeleton-pulse" style={{ width: "35%", height: "12px", borderRadius: "4px" }}></div>
        </div>
      </div>
    </div>
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

  // Base slider settings schema
  const baseSettings = {
    dots: true,
    speed: 500,
    slidesToScroll: 1,
    prevArrow: <PreviousArrow />, 
    nextArrow: <NextArrow />, 
  };

  // Dynamic slider evaluation to prevent initialization crash cycles
  const currentItemsCount = loading ? 4 : collections.length;
  const settings = {
    ...baseSettings,
    infinite: currentItemsCount > 4,
    slidesToShow: Math.min(4, currentItemsCount > 0 ? currentItemsCount : 1),
    arrows: currentItemsCount > 1,
    responsive: [
      {
        breakpoint: 1024, 
        settings: {
          slidesToShow: Math.min(3, currentItemsCount > 0 ? currentItemsCount : 1),
          infinite: currentItemsCount > 3,
        }
      },
      {
        breakpoint: 768, 
        settings: {
          slidesToShow: Math.min(2, currentItemsCount > 0 ? currentItemsCount : 1),
          infinite: currentItemsCount > 2,
        }
      },
      {
        breakpoint: 480, 
        settings: {
          slidesToShow: 1,
          infinite: currentItemsCount > 1,
        }
      }
    ]
  };

  // Fallback fallback if loaded state yields empty results
  if (!loading && collections.length === 0) {
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
          <div className="col-lg-12" style={{ padding: "0 40px" }}>
            <Slider {...settings}>
              {loading
                ? // Render 4 pulse placeholders aligned within slider calculations
                  Array(4)
                    .fill(0)
                    .map((_, index) => <CollectionSkeleton key={`skeleton-${index}`} />)
                : // Render actual collections arrays when payload arrives
                  collections.map((coll) => (
                    <div key={coll.id || coll.nftId} className="px-2">
                      <div className="nft_coll">
                        <div className="nft_wrap">
                          <Link to={`/item-details/${coll.nftId}`}>
                            <img src={coll.nftImage} className="lazy img-fluid" alt={coll.title || "NFT"} />
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
