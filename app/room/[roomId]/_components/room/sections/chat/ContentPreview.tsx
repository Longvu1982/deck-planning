import mql from "@microlink/mql";
import Image from "next/image";
import { FC, useEffect, useState } from "react";

interface LinkPreviewProps {
  content: string;
}

interface URLData {
  author: string | null;
  date: string;
  description: string;
  lang: string;
  logo?: {
    url: string;
    type: string;
    size: number;
    height: number;
    width: number;
  };
  publisher: string;
  title: string;
  url: string;
}

export const urlRegex =
  /[-a-zA-Z0-9@:%._\\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\\+.~#?&//=]*)/;

const ContentPreview: FC<LinkPreviewProps> = ({ content }) => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [data, setData] = useState<URLData>();

  const getUrlData = async () => {
    if (!urlRegex.test(content)) {
      setIsLoading(false);
      return;
    }
    try {
      const data: any = await mql(content);
      console.log(data);
      if (data.status === "success") setData(data.data);
    } catch (e) {
      setData(undefined);
      console.log(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getUrlData();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (isLoading)
    return <div className="w-full h-10 animate-pulse bg-gray-300"></div>;
  if (!data) return content;
  return (
    <div
      onClick={() => window.open(content)}
      className="cursor-pointer hover:opacity-75 flex items-center gap-2"
    >
      {data.logo?.url && (
        <Image
          className="w-6 h-6 rounded-full"
          src={data.logo.url}
          alt={data.title}
          width={200}
          height={200}
        />
      )}
      <div className="flex flex-col">
        <p className="text-sm font-semibold line-clamp-2">{data.title}</p>
        <p className="text-xs font-light">{data.author}</p>
      </div>
    </div>
  );
};

export default ContentPreview;
