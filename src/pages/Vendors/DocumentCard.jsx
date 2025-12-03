import React from "react";
import styles from "./DocumentCard.module.css";
import { FaFilePdf, FaFileImage, FaFileVideo } from "react-icons/fa";
import { Download } from "lucide-react";
import { useLazyGetDocumentQuery } from "@/app/api/profileApi";
import { toaster } from "@/components/ui/toaster";
import { Tooltip } from "@/components/ui/tooltip";
import { Box } from "@chakra-ui/react";

const DocumentCard = ({ doc }) => {
  // choose icon based on file extension
  const [downloadDoc] = useLazyGetDocumentQuery();
  const getIcon = (filename) => {
    if (!filename) return <FaFilePdf className={styles.icon} />;
    const ext = filename.split(".").pop().toLowerCase();
    if (ext === "pdf") return <FaFilePdf className={styles.icon} />;
    if (["jpg", "jpeg", "png"].includes(ext))
      return <FaFileImage className={styles.icon} />;
    if (["mp4", "avi", "mov"].includes(ext))
      return <FaFileVideo className={styles.icon} />;
    return <FaFilePdf className={styles.icon} />;
  };

  const handleDocDownloadClick = () => {
    toaster.promise(downloadDoc(doc?.value?.key).unwrap(), {
      loading: {
        title: "Preparing to download!",
        description: "Please wait...",
      },
      success: (blob) => {
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = doc?.value?.filename; // or dynamic filename
        document.body.appendChild(link);
        link.click();
        link.remove();
        URL.revokeObjectURL(url);
        return {
          title: "Download link generated Successfully",
          description: "Please save the file",
        };
      },
      error: (err) => {
        console.log("DocumentCard:Download Err", err);
        return {
          title: "Error downloading the document",
          description: "Please try again",
        };
      },
    });
  };

  const getLabel = (key) => {
    switch (key) {
      case "ijariCertificate":
        return "Ejari Certificate";
      case "tradeLicense":
        return "Trade License";
      case "vatCertificate":
        return "VAT Certificate";
      case "noc":
        return "NOC";
      case "emiratesId":
        return "Emirates ID";
      case "otherDocument":
        return "Other Document";
      case "poa":
        return "POA";
      default:
        return key;
    }
  };

  return (
    <Box marginBottom={{ base: "20px", md: 0 }} className={styles.infoItem}>
      <strong>{getLabel(doc?.key)}</strong>
      <div className={styles.card}>
        <div className={styles.left}>
          <div className={styles.iconWrapper}>
            {getIcon(doc?.value?.filename)}
          </div>
          <div>
            <Tooltip content={doc?.value?.filename} placement="top">
              <p className={styles.filename}>
                {doc?.value?.filename?.substring(0, 20)}
              </p>
            </Tooltip>
          </div>
        </div>
        <div
          className={`${styles.downloadBtn} cursor-pointer`}
          onClick={handleDocDownloadClick}
        >
          <Download color="#134f4f" size="20px" />
        </div>
      </div>
    </Box>
  );
};

export default DocumentCard;
