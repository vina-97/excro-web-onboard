import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import RiskScoreChart from "./RadialChart/RadialChart";
import ImageLoader from "../../../components/UI/ImageLoader";
import { checkValue, getScore } from "../../../utils";
import useMerchantGenericApproval from "../../../store/useMerchantGenericApproval";
import useMasterStore from "../../../store/useMasterStore";

const QuickFinProfileCard = ({ data }) => {
  const [logoFile, setLogoFile] = useState(null);
  const { uploadFile } = useMerchantGenericApproval();
  const [setShowUpload] = useState(true);
  const { fetchSignedUrl } = useMasterStore();
  const [logo, setLogo] = useState(null);

  const handleLogoUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      await uploadFile(file, data.businessId, "logo");
      setLogoFile(file);
      setShowUpload(false);
    }
  };

  useEffect(() => {
    const getSignedUrl = async () => {
      if (!data?.business?.logo) {
        return;
      }

      try {
        const url = await fetchSignedUrl(data?.business?.logo);
        console.log(url);
        if (url) {
          setLogo(url);
        }
      } catch (error) {
        console.error("Error fetching signed URL:", error);
      }
    };

    getSignedUrl();
  }, []);
  console.log(logo, logoFile, "dsdsds");
  const handleRemove = () => {
    console.log("jgj");
    setLogoFile(null);
    setShowUpload(false); // keep upload hidden
    setLogo("");
  };

  console.log(data);

  // --- MOCK DATA ---

  const details = [
    {
      icon: "onboardBusinessProfile",
      label: "Business ID",
      value: data?.businessId,
    },
    {
      icon: "onboardBusinessProfile",
      label: "Business Name",
      value: data?.name,
    },

    {
      icon: "onboardBusinessEmail",
      label: "Email Address",
      value: data?.email,
    },
    {
      icon: "onboardBusinessPhone",
      label: "Phone Number",
      value: data?.phone?.number
        ? data?.phone?.countryCode + " " + data?.phone?.number
        : "",
    },
    {
      icon: "onboardBusinessEntity",
      label: "Entity",
      value: data?.business?.entity?.name,
    },
  ];

  // --- MAIN RENDER ---
  return (
    <div className="mb-5 flex justify-center w-full">
      <div className="w-full max-w-full pl-5 rounded-2xl bg-linear-to-l from-[#F0F6FF] via-[#F1F3FF] to-[#F4ECFF]">
        <div className="flex flex-col lg:flex-row items-start justify-between gap-6">
          <div className="w-full lg:w-[80%] flex flex-col sm:flex-row items-start gap-4 mt-5">
            <div className="shrink-0 flex items-center justify-center relative">
              {(logo || logoFile) && (
                <div className="relative w-24 h-24 bg-white rounded-xl shadow-lg border border-gray-200 ">
                  <img
                    src={logo ?? URL.createObjectURL(logoFile)}
                    alt="Logo"
                    className="w-full h-full object-cover rounded-xl"
                  />
                  <button
                    type="button"
                    onClick={handleRemove}
                    className="absolute top-1 right-1 bg-white rounded-full w-5 h-5 flex items-center justify-center text-gray-700 hover:bg-gray-100"
                  >
                    ×
                  </button>
                </div>
              )}
              {!logo && !logoFile && (
                <label className="relative w-24 h-24 bg-white rounded-xl shadow-lg border border-gray-200 cursor-pointer transition hover:shadow-xl hover:scale-105 flex flex-col justify-center items-center">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    className="hidden"
                  />
                  <div className="flex flex-col items-center justify-center">
                    <div className="p-2 rounded-full bg-[#5635B330] text-[#5635B3]">
                      <Plus className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] text-[#010101] mt-1 text-center">
                      Upload Logo
                    </span>
                  </div>
                </label>
              )}
            </div>

            {/* Business Info */}
            <div className="w-full">
              <h1 className="text-[#010101] text-xl font-semibold capitalize">
                {data?.business?.legalName}
              </h1>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-5">
                {details?.map((item, i) => (
                  <div key={i} className="flex items-center space-x-3 w-full">
                    <div className="bg-[#E4D9FF] p-3 rounded-xl shrink-0">
                      <ImageLoader imageKey={item.icon} className="w-4 h-4" />
                    </div>
                    <div className="flex flex-col text-sm min-w-0">
                      <span className="text-gray-600 text-sm font-normal mb-1">
                        {item.label}
                      </span>
                      <span
                        className={`text-gray-900 text-sm font-medium truncate max-w-full whitespace-nowrap ${(item.label === "Entity" || item.label === "Business Name") && "capitalize"}`}
                      >
                        {checkValue(item.value)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-center">
            <RiskScoreChart
              score={getScore(data)}
              webCrawl={""}
              from="parent"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickFinProfileCard;
