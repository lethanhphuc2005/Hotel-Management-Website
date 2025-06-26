import { useLoading } from "@/contexts/LoadingContext";
import { fetchContentTypes } from "@/services/ContentTypeService";
import { fetchWebsiteContents } from "@/services/WebsiteContentService";
import { ContentType } from "@/types/contentType";
import { WebsiteContent } from "@/types/websiteContent";
import { useEffect, useState } from "react";

export const useContent = () => {
  const [contentTypes, setContentTypes] = useState<ContentType[]>([]);
  const [websiteContens, setWebsiteContents] = useState<WebsiteContent[]>([]);
  const [didFetch, setDidFetch] = useState(false);
  const { setLoading } = useLoading();

  useEffect(() => {
    if (didFetch) return;
    const fetchContentTypesData = async () => {
      try {
        setLoading(true);
        const response = await fetchContentTypes();
        if (!response.success) {
          console.error(response.message || "Failed to fetch content types");
          return;
        }
        const data = response.data;
        setContentTypes(data);
      } catch (error) {
        console.error("Error fetching content types:", error);
      } finally {
        setLoading(false);
        setDidFetch(true);
      }
    };
    fetchContentTypesData();
  }, [didFetch]);

  useEffect(() => {
    if (didFetch) return;
    const fetchWebsiteContentsData = async () => {
      try {
        setLoading(true);
        const response = await fetchWebsiteContents();
        if (!response.success) {
          console.error(response.message || "Failed to fetch website contents");
          return;
        }
        setWebsiteContents(response.data);
      } catch (error) {
        console.error("Error fetching website contents:", error);
      } finally {
        setLoading(false);
        setDidFetch(true);
      }
    };
    fetchWebsiteContentsData();
  }, [didFetch]);

  return {
    contentTypes,
    websiteContens,
    setContentTypes,
    setWebsiteContents,
  };
};
