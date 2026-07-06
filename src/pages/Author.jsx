import AuthorItems from "../components/author/AuthorItems";
import { Link, useParams } from "react-router-dom";
import React, { useEffect, useState } from "react";
import axios from "axios";

const Author = () => {
  const { id } = useParams();
  const [author, setAuthor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);

  useEffect(() => {
    const fetchAuthor = async () => {
      setLoading(true);
      try {
        const { data } = await axios.get(
          `https://us-central1-nft-cloud-functions.cloudfunctions.net/authors?author=${id}`
        );
        setAuthor(data);
        setIsFollowing(false); // Reset follow state for a new author
      } catch (error) {
        console.error("Error fetching author: ", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAuthor();
  }, [id]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  const toggleFollow = (event) => {
    event.preventDefault();
    if (isFollowing) {
      setAuthor({ ...author, followers: author.followers - 1 });
    } else {
      setAuthor({ ...author, followers: author.followers + 1 });
    }
    setIsFollowing(!isFollowing);
  };

  // Skeleton Loading State
  if (loading) {
    return (
      <div id="wrapper">
        <div className="no-bottom no-top" id="content">
          <div id="top"></div>
          {/* Skeleton Banner */}
          <section id="profile_banner" aria-label="section" style={{ background: "#ddd", height: "300px" }}></section>
          <section aria-label="section">
            <div className="container">
              <div className="row">
                <div className="col-md-12">
                  <div className="d_profile de-flex">
                    <div className="de-flex-col">
                      <div className="profile_avatar">
                        {/* Skeleton Avatar */}
                        <div style={{ width: "150px", height: "150px", borderRadius: "50%", background: "#ddd", display: "inline-block" }}></div>
                        <div className="profile_name" style={{ display: "inline-block", marginLeft: "20px", verticalAlign: "top" }}>
                          {/* Skeleton Text Lines */}
                          <div style={{ width: "200px", height: "24px", background: "#ddd", marginBottom: "10px" }}></div>
                          <div style={{ width: "100px", height: "16px", background: "#ddd", marginBottom: "10px" }}></div>
                          <div style={{ width: "150px", height: "16px", background: "#ddd" }}></div>
                        </div>
                      </div>
                    </div>
                    <div className="profile_follow de-flex">
                      <div className="de-flex-col">
                        {/* Skeleton Follower Count & Button */}
                        <div style={{ width: "100px", height: "16px", background: "#ddd", marginBottom: "10px" }}></div>
                        <div style={{ width: "120px", height: "40px", background: "#ddd", borderRadius: "4px" }}></div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-md-12">
                  <div style={{ marginTop: "30px", height: "200px", background: "#f8f8f8", borderRadius: "8px" }}></div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    );
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
          style={{ background: `url(${author.authorImage}) center` }}
        ></section>
        <section aria-label="section">
          <div className="container">
            <div className="row">
              <div className="col-md-12">
                <div className="d_profile de-flex">
                  <div className="de-flex-col">
                    <div className="profile_avatar">
                      <img src={author.authorImage} alt="" />
                      <i className="fa fa-check"></i>
                      <div className="profile_name">
                        <h4>
                          {author.authorName}
                          <span className="profile_username"> @{author.tag} </span>
                          <span id="wallet" className="profile_wallet">
                            {author.address}
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
                        {author.followers} followers
                      </div>
                      <Link to="#" className="btn-main" onClick={toggleFollow}>
                        {isFollowing ? "Unfollow" : "Follow"}
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-12">
                <div className="de_tab tab_simple">
                  <AuthorItems
                    authorId={author.authorId}
                    authorImage={author.authorImage}
                    items={author.nftCollection}
                  />
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
