import { create } from "zustand";
import ApiCall from "../utils/ApiCall";
import { showFailure } from "../utils";

const useMasterStore = create((set, get) => ({
  // Master data states
  countries: [],
  salesList: [],
  states: [],
  cities: [],
  pincodes: [],
  industries: [],
  entities: [],
  mccCodes: [],
  pagination: {
    countries: { page: 1, totalPages: 1 },
    states: { page: 1, totalPages: 1 },
    cities: { page: 1, totalPages: 1 },
  },
  // Loading states
  loading: false,
  pinLoading: false,
  error: null,
  signedUrl: null,
  flagMapping: {
    AF: "&#127462;&#127467;",
    AL: "&#127462;&#127473;",
    DZ: "&#127465;&#127487;",
    AD: "&#127462;&#127465;",
    AO: "&#127462;&#127476;",
    AG: "&#127462;&#127468;",
    AR: "&#127462;&#127479;",
    AM: "&#127462;&#127474;",
    AU: "&#127462;&#127482;",
    AT: "&#127462;&#127481;",
    AZ: "&#127462;&#127487;",
    BS: "&#127463;&#127480;",
    BH: "&#127463;&#127469;",
    BD: "&#127463;&#127465;",
    BB: "&#127463;&#127463;",
    BY: "&#127463;&#127486;",
    BE: "&#127463;&#127466;",
    BZ: "&#127463;&#127487;",
    BJ: "&#127463;&#127471;",
    BT: "&#127463;&#127481;",
    BO: "&#127463;&#127476;",
    BA: "&#127463;&#127462;",
    BW: "&#127463;&#127484;",
    BR: "&#127463;&#127479;",
    BN: "&#127463;&#127475;",
    BG: "&#127463;&#127468;",
    BF: "&#127463;&#127467;",
    BI: "&#127463;&#127470;",
    KH: "&#127472;&#127469;",
    CM: "&#127464;&#127474;",
    CA: "&#127464;&#127462;",
    CV: "&#127464;&#127483;",
    CF: "&#127464;&#127467;",
    TD: "&#127481;&#127465;",
    CL: "&#127464;&#127473;",
    CN: "&#127464;&#127475;",
    CO: "&#127464;&#127476;",
    KM: "&#127472;&#127474;",
    CD: "&#127464;&#127465;",
    CG: "&#127464;&#127468;",
    CR: "&#127464;&#127479;",
    CI: "&#127464;&#127470;",
    HR: "&#127469;&#127479;",
    CU: "&#127464;&#127482;",
    CY: "&#127464;&#127486;",
    CZ: "&#127464;&#127487;",
    DK: "&#127465;&#127472;",
    DJ: "&#127465;&#127471;",
    DM: "&#127465;&#127474;",
    DO: "&#127465;&#127476;",
    EC: "&#127466;&#127464;",
    EG: "&#127466;&#127468;",
    SV: "&#127480;&#127483;",
    GQ: "&#127468;&#127480;",
    ER: "&#127466;&#127479;",
    EE: "&#127466;&#127466;",
    ET: "&#127466;&#127481;",
    FJ: "&#127467;&#127471;",
    FI: "&#127467;&#127470;",
    FR: "&#127467;&#127479;",
    GA: "&#127468;&#127462;",
    GM: "&#127468;&#127474;",
    GE: "&#127468;&#127466;",
    DE: "&#127465;&#127466;",
    GH: "&#127468;&#127469;",
    GR: "&#127468;&#127479;",
    GD: "&#127468;&#127465;",
    GT: "&#127468;&#127484;",
    GN: "&#127468;&#127475;",
    GW: "&#127468;&#127486;",
    GY: "&#127468;&#127487;",
    HT: "&#127469;&#127481;",
    HN: "&#127469;&#127475;",
    HU: "&#127469;&#127482;",
    IS: "&#127470;&#127480;",
    IN: "&#127470;&#127475;",
    ID: "&#127470;&#127465;",
    IR: "&#127470;&#127479;",
    IQ: "&#127470;&#127478;",
    IE: "&#127470;&#127466;",
    IL: "&#127470;&#127473;",
    IT: "&#127470;&#127481;",
    JM: "&#127471;&#127474;",
    JP: "&#127471;&#127477;",
    JO: "&#127471;&#127476;",
    KZ: "&#127472;&#127487;",
    KE: "&#127472;&#127466;",
    KI: "&#127472;&#127470;",
    KP: "&#127472;&#127477;",
    KR: "&#127472;&#127479;",
    KW: "&#127472;&#127484;",
    KG: "&#127472;&#127468;",
    LA: "&#127473;&#127462;",
    LV: "&#127473;&#127483;",
    LB: "&#127473;&#127463;",
    LS: "&#127473;&#127480;",
    LR: "&#127473;&#127479;",
    LY: "&#127473;&#127484;",
    LI: "&#127473;&#127470;",
    LT: "&#127473;&#127481;",
    LU: "&#127473;&#127482;",
    MG: "&#127474;&#127472;",
    MW: "&#127475;&#127484;",
    MY: "&#127475;&#127486;",
    MV: "&#127474;&#127487;",
    ML: "&#127474;&#127476;",
    MT: "&#127474;&#127485;",
    MH: "&#127474;&#127473;",
    MR: "&#127474;&#127483;",
    MU: "&#127474;&#127486;",
    MX: "&#127475;&#127485;",
    FM: "&#127467;&#127474;",
    MD: "&#127474;&#127468;",
    MC: "&#127474;&#127466;",
    MN: "&#127474;&#127479;",
    ME: "&#127474;&#127469;",
    MA: "&#127474;&#127462;",
    MZ: "&#127475;&#127487;",
    MM: "&#127474;&#127477;",
    NA: "&#127476;&#127462;",
    NR: "&#127476;&#127483;",
    NP: "&#127476;&#127481;",
    NL: "&#127476;&#127473;",
    NZ: "&#127476;&#127487;",
    NI: "&#127476;&#127470;",
    NE: "&#127476;&#127466;",
    NG: "&#127476;&#127468;",
    NO: "&#127476;&#127480;",
    OM: "&#127477;&#127474;",
    PK: "&#127477;&#127472;",
    PW: "&#127477;&#127484;",
    PA: "&#127477;&#127462;",
    PG: "&#127477;&#127468;",
    PY: "&#127477;&#127485;",
    PE: "&#127477;&#127466;",
    PH: "&#127477;&#127469;",
    PL: "&#127477;&#127473;",
    PT: "&#127477;&#127481;",
    QA: "&#127478;&#127462;",
    RO: "&#127479;&#127476;",
    RU: "&#127479;&#127482;",
    RW: "&#127479;&#127484;",
    KN: "&#127472;&#127475;",
    LC: "&#127473;&#127464;",
    VC: "&#127483;&#127464;",
    WS: "&#127484;&#127480;",
    SM: "&#127480;&#127474;",
    ST: "&#127480;&#127481;",
    SA: "&#127480;&#127462;",
    SN: "&#127480;&#127475;",
    RS: "&#127479;&#127480;",
    SC: "&#127480;&#127468;",
    SL: "&#127480;&#127473;",
    SG: "&#127480;&#127472;",
    SK: "&#127480;&#127472;",
    SI: "&#127480;&#127470;",
    SB: "&#127480;&#127463;",
    SO: "&#127480;&#127476;",
    ZA: "&#127487;&#127462;",
    SS: "&#127480;&#127480;",
    ES: "&#127466;&#127480;",
    LK: "&#127473;&#127475;",
    SD: "&#127480;&#127469;",
    SR: "&#127480;&#127479;",
    SE: "&#127480;&#127466;",
    CH: "&#127464;&#127469;",
    SY: "&#127480;&#127486;",
    TW: "&#127481;&#127487;",
    TJ: "&#127481;&#127470;",
    TZ: "&#127481;&#127490;",
    TH: "&#127481;&#127469;",
    TL: "&#127481;&#127473;",
    TG: "&#127481;&#127468;",
    TO: "&#127481;&#127476;",
    TT: "&#127481;&#127481;",
    TN: "&#127481;&#127475;",
    TR: "&#127481;&#127479;",
    TM: "&#127481;&#127474;",
    UG: "&#127482;&#127468;",
    UA: "&#127482;&#127462;",
    AE: "&#127462;&#127466;",
    GB: "&#127468;&#127463;",
    US: "&#127482;&#127480;",
    UY: "&#127482;&#127485;",
    UZ: "&#127482;&#127487;",
    VU: "&#127483;&#127486;",
    VE: "&#127483;&#127466;",
    VN: "&#127483;&#127475;",
    YE: "&#127486;&#127466;",
    ZM: "&#127487;&#127474;",
    ZW: "&#127487;&#127484;",
    VA: "&#127483;&#127462;",
    PS: "&#127477;&#127480;",
  },
  setCountries: (data) => ({ countries: data }),
  setPincodes: (data) => ({ pincodes: data }),

  // Fetch all countries
  fetchCountries: async (__, page, limit, query, searchQuery) => {
    const state = get();

    try {
      set({ loading: true }); // Ensure loading is set
      const queryParams = query ? `&id=${query}` : "";
      const searchQueryParams = searchQuery ? `&name=${searchQuery}` : "";
      const response = await new Promise((resolve, reject) => {
        ApiCall.get(
          `onboarding/properties/country?page=${page}&limit=${limit}${queryParams}${searchQueryParams}`,
          (res) => {
            res?.success
              ? resolve(res.data)
              : reject(res?.message || "Failed to fetch countries");
          },
        );
      });
      console.log(response, "api", state);

      // 🟣 Optionally de-duplicate by id here

      const newCountries = Array.isArray(response.countries)
        ? response.countries.filter(
            (c) => !state.countries.some((existing) => existing.id === c.id),
          )
        : [];

      set({
        countries:
          query || searchQuery
            ? response.countries
            : [...state.countries, ...newCountries],
        loading: false,
      });
      console.log(newCountries);

      return query || searchQuery ? response.countries : newCountries;
    } catch (error) {
      set({ error: error.message, loading: false });
      console.error("Failed to fetch countries:", error);
      return [];
    }
  },

  fetchSalesList: async (__, page, limit) => {
    const state = get();
    console.log(state);

    try {
      set({ loading: true });
      const response = await new Promise((resolve, reject) => {
        ApiCall.get(
          `onboarding/client/sales/list?page=${page}&limit=${limit}`,
          (res) => {
            res?.success
              ? resolve(res.data)
              : reject(res?.message || "Failed to fetch countries");
          },
        );
      });

      // 🟣 Optionally de-duplicate by id here
      const newSalesList = Array.isArray(response)
        ? response.filter(
            (c) => !state.salesList.some((existing) => existing.id === c.id),
          )
        : [];

      set({
        salesList: [...state.salesList, ...newSalesList],
        loading: false,
      });

      return newSalesList;
    } catch (error) {
      set({ error: error.message, loading: false });
      console.error("Failed to fetch countries:", error);
      return [];
    }
  },

  // Fetch states by country
  fetchStates: async (__, page, limit) => {
    const state = get();
    console.log(state);

    try {
      set({ loading: true }); // Ensure loading is set
      const response = await new Promise((resolve, reject) => {
        ApiCall.get(
          `onboarding/properties/state?page=${page}&limit=${limit}`,
          (res) => {
            res?.success
              ? resolve(res.data)
              : reject(res?.message || "Failed to fetch states");
          },
        );
      });
      // 🟣 Optionally de-duplicate by id here
      const newStates = Array.isArray(response)
        ? response.filter(
            (c) => !state.states.some((existing) => existing.code === c.code),
          )
        : [];

      set({
        states: [...state.states, ...newStates],
        loading: false,
      });

      return newStates;
    } catch (error) {
      set({ error: error.message, loading: false });
      console.error("Failed to fetch states:", error);
    }
  },

  // Fetch cities by state
  fetchCities: async (__, page, limit) => {
    const state = get();
    console.log(state);

    try {
      set({ loading: true }); // Ensure loading is set
      const response = await new Promise((resolve, reject) => {
        ApiCall.get(
          `onboarding/properties/city?page=${page}&limit=${limit}`,
          (res) => {
            res?.success
              ? resolve(res.data)
              : reject(res?.message || "Failed to fetch cities");
          },
        );
      });
      // 🟣 Optionally de-duplicate by id here
      const newCities = Array.isArray(response.cities)
        ? response.cities.filter(
            (c) => !state.cities.some((existing) => existing.name === c.name),
          )
        : [];

      set({
        cities: [...state.cities, ...newCities],
        loading: false,
      });

      return newCities;
      //   set({ cities: response, loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
      console.error("Failed to fetch cities:", error);
    }
  },

  // Fetch pincodes by city
  fetchPincodes: async (__, page, limit, searchQuery) => {
    const state = get();
    const searchQueryParams = searchQuery ? `&pinCode=${searchQuery}` : "";

    try {
      set({ pinLoading: true }); // Ensure loading is set
      const response = await new Promise((resolve, reject) => {
        ApiCall.get(
          `onboarding/properties/pincode?page=${page}&limit=${limit}${searchQueryParams}`,
          (res) => {
            res?.success
              ? resolve(res.data)
              : reject(res?.message || "Failed to fetch pincodes");
          },
        );
      });
      // 🟣 Optionally de-duplicate by id here
      const newPincodes = Array.isArray(response.pincodes)
        ? response.pincodes.filter(
            (c) => !state.pincodes.some((existing) => existing.id === c.id),
          )
        : [];
      console.log(state, response, searchQuery, "api");

      set({
        pincodes: searchQuery
          ? response.pincodes
          : [...state.pincodes, ...newPincodes],
        pinLoading: false,
      });

      return searchQuery ? response.pincodes : newPincodes;
    } catch (error) {
      set({ error: error.message, pinLoading: false });
      console.error("Failed to fetch pincodes:", error);
    }
  },

  // Fetch all industries
  fetchIndustries: async (__, page, limit) => {
    const state = get();
    console.log(state);
    try {
      set({ loading: true }); // Ensure loading is set
      const response = await new Promise((resolve, reject) => {
        ApiCall.get(
          `onboarding/properties/industry?page=${page}&limit=${limit}`,
          (res) => {
            res?.success
              ? resolve(res.data)
              : reject(res?.message || "Failed to fetch industries");
          },
        );
      });
      console.log(response);

      // 🟣 Optionally de-duplicate by id here
      const newIndustries = Array.isArray(response)
        ? response.filter(
            (c) =>
              !state.industries.some((existing) => existing.code === c.code),
          )
        : [];

      set({
        industries: [...state.industries, ...newIndustries],
        loading: false,
      });

      return newIndustries;
    } catch (error) {
      set({ error: error.message, loading: false });
      console.error("Failed to fetch industries:", error);
    }
  },

  // Fetch all entity types
  fetchEntities: async (__, page, limit, query) => {
    const state = get();
    console.log(state);
    try {
      set({ loading: true }); // Ensure loading is set
      const queryParams = query ? `&entityType=${query}` : "";

      const response = await new Promise((resolve, reject) => {
        ApiCall.get(
          `onboarding/properties/entity?page=${page}&limit=${limit}&status=active${queryParams}`,
          (res) => {
            res?.success
              ? resolve(res.data)
              : reject(res?.message || "Failed to fetch entities");
          },
        );
      });

      set({
        entities: response.entities,
        loading: false,
      });
      return response.entities;
    } catch (error) {
      set({ error: error.message, loading: false });
      console.error("Failed to fetch entities:", error);
    }
  },

  // Fetch all MCC codes
  fetchMccCodes: async (__, page, limit) => {
    const state = get();

    try {
      set({ loading: true }); // Ensure loading is set
      const response = await new Promise((resolve, reject) => {
        ApiCall.get(
          `onboarding/properties/mcc?page=${page}&limit=${limit}`,
          (res) => {
            res?.success
              ? resolve(res.data)
              : reject(res?.message || "Failed to fetch MCC codes");
          },
        );
      });

      // 🟣 Optionally de-duplicate by id here
      const newMCCS = Array.isArray(response)
        ? response.filter(
            (c) => !state.mccCodes.some((existing) => existing.code === c.code),
          )
        : [];

      set({
        mccCodes: [...state.mccCodes, ...newMCCS],
        loading: false,
      });

      return newMCCS;

      //   set({ mccCodes: response.mccs, loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
      console.error("Failed to fetch MCC codes:", error);
    }
  },

  fetchSignedUrl: async (filePath = "") => {
    if (!filePath) {
      return Promise.reject("File path is required");
    }

    try {
      set({ isLoading: true });
      const response = await new Promise((resolve, reject) => {
        ApiCall.get(
          `onboarding/s3/signed-url?key=${encodeURIComponent(filePath)}`,
          (res) => {
            res?.success
              ? resolve(res.data)
              : reject(res?.message || "Failed to fetch Signed Url");
          },
        );
      });
      console.log(response);

      set({ signedUrl: response.data, isLoading: false });
      return response;
    } catch (error) {
      const errMsg =
        error?.message || "Something went wrong while fetching signed URL";
      showFailure(errMsg);
      set({ signedUrl: null, isLoading: false });
      return Promise.reject(errMsg); // ✅ reject on exception
    }
  },

  // Reset all master data
  resetMasterData: () =>
    set({
      countries: [],
      states: [],
      cities: [],
      pincodes: [],
      industries: [],
      entities: [],
      mccCodes: [],
      error: null,
      loading: false,
    }),
}));

export default useMasterStore;
