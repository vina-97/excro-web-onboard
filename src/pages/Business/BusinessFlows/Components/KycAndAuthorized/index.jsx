import AuthorizedForms from "./Components/AuthorizedForms";
import KycForms from "./Components/KycForms";

const KYCAndAuthorized = ({ stepProps }) => {
  return (
    <div>
      <AuthorizedForms {...stepProps} />
      <KycForms {...stepProps} />
    </div>
  );
};

export default KYCAndAuthorized;
