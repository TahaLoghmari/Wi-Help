import { Helmet } from "react-helmet-async";

type HeadProps = {
  title?: string;
  description?: string;
};

const APP_NAME = "Wi-Help";

export const Head = ({ title = "", description = "" }: HeadProps = {}) => {
  const pageTitle = title ? `${title} | ${APP_NAME}` : APP_NAME;

  return (
    <Helmet>
      <title>{pageTitle}</title>
      {description && <meta name="description" content={description} />}
    </Helmet>
  );
};
