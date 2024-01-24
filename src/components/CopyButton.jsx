import {useState} from "react";
import copyToClipboard from "copy-to-clipboard";
import {CheckCircleOutlined, CopyOutlined} from "@ant-design/icons";
import PropTypes from "prop-types";

export const CopyButton = (props) => {
  const [copySuccess, setCopySuccess] = useState(false);

  const copy = () => {
    copyToClipboard(props.data);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000); // Switch back to `copy` icon after 2 seconds.
  }

  if (!props.data) {
    return <CopyOutlined style={{ display: 'none', cursor: 'not-allowed' }} />;
  }

  if (copySuccess) {
    return <CheckCircleOutlined onClick={copy} />;
  } else {
    return <CopyOutlined onClick={copy} />;
  }
}
CopyButton.propTypes = {
  data: PropTypes.any,  // Adjust to more specific type if possible
};