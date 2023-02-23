import { Company } from "@reducers/admin/companyListReducer";
import CompanyElement from "./CompanyElement";

interface Props {
  companies: {
    [key: number]: Company;
  },
  locked?: boolean;
}

const Companies = ({
  companies,
  locked = false
}: Props) => {
  const companiesRendered = Object.values(companies).sort((c1, c2) => {
    return c1.name.localeCompare(c2.name);
  }).map(company => {

    return <CompanyElement
      key={company.id}
      company={company}
      locked={locked}
    />
  });

  return (
    <>
      {companiesRendered}
    </>
  )
};

export default Companies;