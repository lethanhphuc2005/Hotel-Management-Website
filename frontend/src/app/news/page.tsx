"use client";
import { New1, New2, New3, New4 } from "@/components/news/newsItem";
import { fetchWebsiteContents } from "@/services/WebsiteContentService";
import { WebsiteContent } from "@/types/websiteContent";
import { useEffect, useState } from "react";

export default function News() {
  const [websiteContents, setWebsiteContents] = useState<WebsiteContent[]>([]);

  useEffect(() => {
    try {
      const fetchWebsiteContentsData = async () => {
        const response = await fetchWebsiteContents();
        if (!response.success) {
          console.error("Failed to fetch website contents:", response.message);
          return;
        }

        setWebsiteContents(response.data);
      };
      fetchWebsiteContentsData();
    } catch (error) {
      console.error("Error fetching website contents:", error);
    }
  });
  return (
    <>
      <div
        className="container text-white"
        style={{ marginTop: "130px", marginBottom: "100px" }}
      >
        <div className="row border-top border-bottom">
          <h1
            className="mt-4 mb-4 text-center"
            style={{ letterSpacing: "10px" }}
          >
            TIN TỨC VỀ CHÚNG TÔI
          </h1>
        </div>
        <div className="row border-bottom">
          <img
            className="w-100 mt-3 mb-3"
            style={{ height: "300px", objectFit: "cover" }}
            src="/img/bannernew.png"
            alt=""
          />
        </div>
        <New1 new1={websiteContents[0]} />
        <div className="row mt-4 border-top">
          <div className="col-8 border-end">
            <New2 new2={websiteContents[1]} />
            <New3 new3={websiteContents[3]} />
          </div>
          <div className="col-4">
            <New4 new4={websiteContents[4]} />
          </div>
        </div>
      </div>
    </>
  );
}
