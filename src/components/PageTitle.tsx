import { Helmet } from "react-helmet-async";
import * as PropTypes from "prop-types";

function PageTitle({title}:any) {
    return <Helmet><title>{title} | WE.DING</title></Helmet>;
}

PageTitle.propTypes = {
    title:PropTypes.string.isRequired,
}

export default PageTitle;