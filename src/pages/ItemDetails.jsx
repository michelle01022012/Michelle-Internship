import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import EthImage from "../images/ethereum.svg";
import axios from "axios";

const ItemDetails = () => {
  const { id: nftId } = useParams();
  const [nftData, setNftData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);

    const fetchNftDetails = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(
          `https://us-central1-nft-cloud-functions.cloudfunctions.net/itemDetails?nftId=${nftId}`
        );
        setNftData(data);
      } catch (error) {
        console.error("Error fetching NFT details:", error);
      } finally {
        setLoading(false);
      }
    };

    if (nftId) {
      fetchNftDetails();
    }
  }, [nftId]);

  return (
    <div id="wrapper">
      <div className="no-bottom no-top" id="content">
        <div id="top"></div>
        <section aria-label="section" className="mt90 sm-mt-0">
          <div className="container">
            <div className="row">
              {loading ? (
                /* --- SKELETON LOADING STATE --- */
                <>
                  <div className="col-md-6 text-center">
                    <div
                      className="skeleton-box img-fluid img-rounded mb-sm-30"
                      style={{ width: "100%", height: "450px", borderRadius: "8px" }}
                    ></div>
                  </div>
                  <div className="col-md-6">
                    <div className="item_info">
                      <div className="skeleton-box" style={{ width: "60%", height: "40px", marginBottom: "15px" }}></div>
                      <div className="item_info_counts" style={{ display: "flex", gap: "15px" }}>
                        <div className="skeleton-box" style={{ width: "60px", height: "20px" }}></div>
                        <div className="skeleton-box" style={{ width: "60px", height: "20px" }}></div>
                      </div>
                      <div className="skeleton-box" style={{ width: "100%", height: "80px", marginTop: "20px", marginBottom: "20px" }}></div>
                      
                      <div className="d-flex flex-row">
                        <div className="mr40">
                          <h6>Owner</h6>
                          <div className="item_author">
                            <div className="author_list_pp">
                              <div className="skeleton-box" style={{ width: "50px", height: "50px", borderRadius: "50%" }}></div>
                            </div>
                            <div className="author_list_info" style={{ marginLeft: "15px" }}>
                              <div className="skeleton-box" style={{ width: "100px", height: "20px" }}></div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="de_tab tab_simple" style={{ marginTop: "20px" }}>
                        <h6>Creator</h6>
                        <div className="item_author">
                          <div className="author_list_pp">
                            <div className="skeleton-box" style={{ width: "50px", height: "50px", borderRadius: "50%" }}></div>
                          </div>
                          <div className="author_list_info" style={{ marginLeft: "15px" }}>
                            <div className="skeleton-box" style={{ width: "100px", height: "20px" }}></div>
                          </div>
                        </div>
                        <div className="spacer-40"></div>
                        <h6>Price</h6>
                        <div className="skeleton-box" style={{ width: "80px", height: "30px" }}></div>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                /* --- DYNAMIC DATA POPULATION --- */
                <>
                  <div className="col-md-6 text-center">
                    <img src={nftData?.nftImage} className="img-fluid img-rounded mb-sm-30 nft-image" alt="" />
                  </div>
                  <div className="col-md-6">
                    <div className="item_info">
                      <h2>{nftData?.title}</h2>
                      <div className="item_info_counts">
                        <div className="item_info_views">
                          <i className="fa fa-eye"></i> {nftData?.views}
                        </div>
                        <div className="item_info_like">
                          <i className="fa fa-heart"></i> {nftData?.likes}
                        </div>
                      </div>
                      <p>{nftData?.description}</p>
                      <div className="d-flex flex-row">
                        <div className="mr40">
                          <h6>Owner</h6>
                          <div className="item_author">
                            <div className="author_list_pp">
                              <Link to={`/author/${nftData?.ownerId}`}>
                                <img className="lazy" src={nftData?.ownerImage} alt="" />
                                <i className="fa fa-check"></i>
                              </Link>
                            </div>
                            <div className="author_list_info">
                              <Link to={`/author/${nftData?.ownerId}`}>{nftData?.ownerName}</Link>
                            </div>
                          </div>
                        </div>
                        <div></div>
                      </div>
                      <div className="de_tab tab_simple">
                        <div className="de_tab_content">
                          <h6>Creator</h6>
                          <div className="item_author">
                            <div className="author_list_pp">
                              <Link to={`/author/${nftData?.creatorId}`}>
                                <img className="lazy" src={nftData?.creatorImage} alt="" />
                                <i className="fa fa-check"></i>
                              </Link>
                            </div>
                            <div className="author_list_info">
                              <Link to={`/author/${nftData?.creatorId}`}>{nftData?.creatorName}</Link>
                            </div>
                          </div>
                        </div>
                        <div className="spacer-40"></div>
                        <h6>Price</h6>
                        <div className="nft-item-price">
                          <img src={EthImage} alt="" />
                          <span>{nftData?.price}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default ItemDetails;