import React, { useState, useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";
import EntityInfoCard from "./Components/EntityInfoCard";
import KYCCategoryInfo from "./Components/KYCCategoryInfo";
import useEntityListStore from "../../../store/useEntityListStore";
import BreadCrumbs from "../../../components/Layout/BreadCrumbs";

const EntityDetail = () => {
  const { fetchEntityDetail, entityDetail } = useEntityListStore();
  const { entityId } = useParams();
  const location = useLocation();

  const [entityData, setEntityData] = useState({
    entityType: "",
    entityName: "",
  });

  useEffect(() => {
    if (entityId) {
      fetchEntityDetail(entityId);
    }
  }, [entityId]);

  useEffect(() => {
    if (entityId && entityDetail) {
      setEntityData({
        entityType: entityDetail?.entityType || "",
        entityName: entityDetail?.entity?.name || "",
      });
    }
  }, [entityDetail]);
  useEffect(() => {
    if (location?.pathname?.split("/").includes("create-entity")) {
      setEntityData({
        entityType: "",
        entityName: "",
      });
    }
  }, [location]);

  const handleGetValue = (e) => {
    const { name, value } = e;
    setEntityData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  console.log(entityData, entityDetail);
  return (
    <>
      <div className="mb-5">
        <BreadCrumbs />
      </div>
      <EntityInfoCard EntityData={entityData} getValue={handleGetValue} />
      <KYCCategoryInfo EntityData={entityData} />
    </>
  );
};

export default EntityDetail;
