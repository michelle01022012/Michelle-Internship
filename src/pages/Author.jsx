import AuthorBanner from "../images/author_banner.jpg";
import AuthorItems from "../components/author/AuthorItems";
import { Link, useParams } from "react-router-dom";
import AuthorImage from "../images/author_thumbnail.jpg";
import React, { useEffect, useState } from "react";
import axios from "axios";

const Author = () => {
  const { id } = useParams();
  const [sellers, setSellers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSellers = async () => {
      try {
        const { data } = await axios.get(
          "https://us-central1-nft-cloud-functions.cloudfunctions.net/topSellers"
        );

        setSellers(data);
      } catch (error) {
        console.error("Error fetching sellers: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSellers();
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

 const author = sellers.find((seller) => String(seller.authorId) === id);

if (loading) {
  return <div>Loading...</div>;
}

if (!author) {
  return <div>Author not found</div>;
}
  return (
    <div id="wrapper">
      <div className="no-bottom no-top" id="content">
        <div id="top"></div>
        <section
          id="profile_banner"
          aria-label="section"
          className="text-light"
          data-bgimage="url(images/author_banner.jpg) top"
          style={{ background: `url(${AuthorBanner}) top` }}
        ></section>

        <section aria-label="section">
          <div className="container">
            <div className="row">
              <div className="col-md-12">
                <div className="d_profile de-flex">
                  <div className="de-flex-col">
                    <div className="profile_avatar">
                      <img src={author?.authorImage || AuthorImage} alt="" />
                      <i className="fa fa-check"></i>
                      <div className="profile_name">
                        <h4>
                          {author?.authorName || "Monica Lucas"}
                          <span className="profile_username">
                         @{author?.tag || author?.authorName?.toLowerCase().replace(/\s/g, "")}
                          </span>
                          <span id="wallet" className="profile_wallet">
                            {author?.address || "Wallet address not available"}
                          </span>
                          <button id="btn_copy" title="Copy Text">
                            Copy
                          </button>
                        </h4>
                      </div>
                    </div>
                  </div>
                  <div className="profile_follow de-flex">
                    <div className="de-flex-col">
                      <div className="profile_follower">
                        {author?.followers ? `${author.followers} followers` : "Followers not available"}
                      </div>
                      <Link to="#" className="btn-main">
                        Follow
                      </Link>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-md-12">
                <div className="de_tab tab_simple">
                 <AuthorItems authorId={author.authorId} />
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Author;
