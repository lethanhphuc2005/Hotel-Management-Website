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
        const data = await fetchContentTypes();
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
        const data = await fetchWebsiteContents();
        setWebsiteContents(data);
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
