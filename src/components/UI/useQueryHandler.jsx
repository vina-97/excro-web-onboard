import { useSearchParams } from "react-router-dom";

const useQueryHandler = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const checkQueryValid = (newQuery, search) => {
    const params = new URLSearchParams(window.location.search);
    // Convert existing params into an object
    // const currentParams = Object.fromEntries([...searchParams]);
    const currentParams = Object.fromEntries([...searchParams]);

    const mergedQuery = { ...currentParams, ...newQuery };
    // ✅ keys you want to keep unique
    // const uniqueQueryKeys = ['email', 'phone', 'businessId'];

    // // If any of those unique keys are in newQuery, remove the others
    // const selectedKey = Object.keys(newQuery).find((k) =>
    //   uniqueQueryKeys.includes(k)
    // );

    // if (selectedKey) {
    //   uniqueQueryKeys.forEach((k) => {
    //     if (k !== selectedKey) {params.delete(k)};
    //   });
    // }
    Object.entries(mergedQuery).forEach(([key, value]) => {
      const hasKey = key !== null && key !== undefined && key !== "";
      const hasValue = value !== null && value !== undefined && value !== "";

      if (!hasKey) {
        return;
      } // skip invalid key
      if (search) {
        if (hasValue) {
          return params.set(key, value.trim());
        } else {
          params.delete(key);
        }
      } else {
        if (hasValue) {
          return params.set(key, value.trim());
        }
      }
    });

    // Update URL params
    setSearchParams(params);
  };

  return { searchParams, checkQueryValid };
};

export default useQueryHandler;
