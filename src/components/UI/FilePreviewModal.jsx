import { useEffect, useState } from "react";
import { Modal, Spin } from "antd";
import ImageLoader from "./ImageLoader";
import useMasterStore from "../../store/useMasterStore";

const HEADER_HEIGHT = 56;

function FilePreviewModal({ open, setOpen, data }) {
  const [signedUrl, setSignedUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const { fetchSignedUrl } = useMasterStore();

  const isImage =
    typeof data === "string" ? /\.(jpg|jpeg|png|webp)$/i.test(data) : false;

  useEffect(() => {
    if (!open || !data) {
      return;
    }

    const getSignedUrl = async () => {
      setLoading(true);
      try {
        const url = await fetchSignedUrl(data);
        setSignedUrl(url);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    getSignedUrl();
  }, [open, data, fetchSignedUrl]);

  return (
    <Modal
      open={open}
      onCancel={() => setOpen(false)}
      footer={null}
      closable={false}
      maskClosable={false}
      width="100vw"
      style={{ top: 0, padding: 0 }}
      styles={{
        content: {
          height: "100vh",
          padding: 0,
          background: "#000",
        },
      }}
    >
      {/* HEADER */}
      <div
        className="fixed top-0 left-0 right-0 z-10 flex items-center justify-between px-6 bg-[#111]"
        style={{ height: HEADER_HEIGHT }}
      >
        <p className="text-white text-lg truncate max-w-[85%]">
          {data?.docsData?.name || "Preview"}
        </p>

        <button onClick={() => setOpen(false)}>
          <ImageLoader
            imageKey="onboardBusinessClosePreview"
            className="w-5 h-5"
          />
        </button>
      </div>

      {/* CONTENT */}
      <div
        className="w-full overflow-auto flex items-center justify-center"
        style={{
          height: `calc(100vh - ${HEADER_HEIGHT}px)`,
          marginTop: HEADER_HEIGHT,
        }}
      >
        {loading ? (
          <Spin size="large" />
        ) : signedUrl ? (
          isImage ? (
            <img
              src={signedUrl}
              alt="preview"
              className="max-w-full object-contain"
              style={{ maxHeight: "100%" }}
            />
          ) : (
            <iframe
              src={signedUrl}
              title="Preview"
              className="w-full h-full border-none"
            />
          )
        ) : (
          <p className="text-white">No file to preview</p>
        )}
      </div>
    </Modal>
  );
}

export default FilePreviewModal;
