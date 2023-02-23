import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';

interface Props {
  children: any;
  placement?: string;
  hideDelay?: number;
  showDelay?: number;
  show?: boolean;
  content: any;
}

const CustomTooltip = ({
  children,
  placement,
  content,
  hideDelay = 300,
  showDelay = 0,
  show
}: Props) => {
  const renderTooltip = (props: any) => {
    return (
      <Tooltip {...props}>
        {content}
      </Tooltip>
    );
  }

  return content != null ? (
    <OverlayTrigger
      placement={(placement as any) ?? "top"}
      delay={{ show: showDelay, hide: hideDelay }}
      overlay={renderTooltip}
      show={show}
    >
      {children}
    </OverlayTrigger>
  ) : (
    <>{children}</>
  );
}

export default CustomTooltip;
