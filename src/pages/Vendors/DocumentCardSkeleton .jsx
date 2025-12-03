import React from "react";
import styles from "./DocumentCard.module.css";
import { Download } from "lucide-react";
import { Tooltip } from "@/components/ui/tooltip";
import { Skeleton, SkeletonCircle } from "@chakra-ui/react";

const DocumentCardSkeleton = () => {
  return (
    <div className={styles.card}>
      <div className={styles.left}>
        <SkeletonCircle height="30px" width="30px" variant="shine" />
        <div>
          <Skeleton height="15px" width="180px" variant="shine" />
        </div>
      </div>
      <div className={`${styles.downloadBtn} cursor-pointer`}>
        <Skeleton height="20px" width="20px" variant="shine" />
      </div>
    </div>
  );
};

export default DocumentCardSkeleton;
