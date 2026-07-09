import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import AOS from "aos";
import "aos/dist/aos.css";

const TopSellers = () => {
  const [sellers, setSellers] = useState([]);
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
    if (!loading && sellers.length > 0) {
      AOS.refresh();
    }
  }, [loading, sellers]);

  useEffect(() => {
    const fetchTopSellers = async () => {
      try {
        const { data } = await axios.get(
          "https://us-central1-nft-cloud-functions.cloudfunctions.net/topSellers"
        );
        setSellers(data);
      } catch (error) {
        console.error("Error fetching top sellers: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTopSellers();
  }, []);

  return (
    <section id="section-popular" className="pb-5">
      <div className="container">
        <div className="row">
          <div className="col-lg-12">
            <div className="text-center">
              <h2>Top Sellers</h2>
              <div className="small-border bg-color-2"></div>
            </div>
          </div>
          <div className="col-md-12">
            <ol className="author_list">
              {loading
                ? // Skeleton Loading State
                  new Array(12).fill(0).map((_, index) => (
                    <li key={index}>
                      <div className="author_list_pp">
                        <div
                          className="skeleton-loading"
                          style={{
                            width: "50px",
                            height: "50px",
                            borderRadius: "50%",
                          }}
                        ></div>
                      </div>
                      <div className="author_list_info">
                        <div
                          className="skeleton-loading"
                          style={{
                            width: "100px",
                            height: "16px",
                            marginBottom: "6px",
                          }}
                        ></div>
                        <div
                          className="skeleton-loading"
                          style={{ width: "60px", height: "14px" }}
                        ></div>
                      </div>
                    </li>
                  ))
                : // Dynamic Data State
                  sellers.map((seller) => (
                    // 3. Applied data-aos attribute directly to the list item wrapper
                    <li key={seller.id} data-aos="fade-left">
                      <div className="author_list_pp">
                        {/* Updated to dynamic backticks pathing using seller.authorId */}
                        <Link to={`/author/${seller.authorId}`}>
                          <img
                            className="lazy pp-author"
                            src={seller.authorImage}
                            alt={seller.authorName}
                          />
                          <i className="fa fa-check"></i>
                        </Link>
                      </div>
                      <div className="author_list_info">
                        {/* Updated to dynamic backticks pathing using seller.authorId */}
                        <Link to={`/author/${seller.authorId}`}>
                          {seller.authorName}
                        </Link>
                        <span>{seller.price} ETH</span>
                      </div>
                    </li>
                  ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TopSellers;
