import React, { useState } from "react";
import pdfimg from "../assets/images/pdf.png";
import images from "../assets/images/images.png";
import FilePreviewModal from "./FilePreviewModal";

const PreviewDocs = ({ ...props }) => {
  console.log(props);
  const [open, setOpen] = useState(false);
  const supporting = props?.transactionData?.supporting_document
    ? props?.transactionData?.supporting_document
    : props?.transactionData;
  const url = supporting?.signedUrl
    ? supporting?.signedUrl
    : supporting?.signed_url;
  const file = supporting?.fileName
    ? supporting?.fileName
    : supporting?.file_name;
  console.log(supporting);
  const ext = file?.split(".").pop().toLowerCase();

  const openFullView = () => {
    if (url) {
      // window.open(url, "_blank"); // opens full view in a new tab
      setOpen(true);
    }
  };
  return url ? (
    <div className="col-xs-12 p-0">
      <p className={props.labelStyle ? props.labelStyle : "account-head"}>
        Proof of Transaction
      </p>
      {/* <div className="info_title">Preview</div> */}
      <div className=" p-l-0">
        <div className="">
          <div className="doc-item">
            <button
              type="button"
              onClick={openFullView}
              className="doc-preview "
              title={file}
            >
              <img src={ext === "pdf" ? pdfimg : images} alt="docs" />
              <span className="doc-name">{file}</span>
            </button>
          </div>
        </div>
      </div>

      {/* <div className="col-xs-6 p-l-0">
        <div className="docs-control">
          <div className="doc-item">
            <button
              type="button"
              onClick={openFullView}
              className="doc-preview"
              title={uploadDocs?.fileName}
            >
              <img
                src={docsData.type === "application/pdf" ? pdfimg : images}
                alt="docs"
              />
              <span className="doc-name">{uploadDocs?.fileName}</span>
            </button>
            <button
              type="button"
              className="remove-docs"
              onClick={handleRemoveDoc}
              aria-label="Remove document"
            >
              ×
            </button>
          </div>
        </div>
      </div> */}

      <FilePreviewModal
        data={{ signedUrl: url, docsData: { type: ext } }}
        open={open}
        setOpen={setOpen}
      />
    </div>
  ) : (
    ""
  );
};

export default PreviewDocs;
