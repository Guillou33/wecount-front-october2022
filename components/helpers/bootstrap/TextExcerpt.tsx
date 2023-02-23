import Tooltip from "@components/helpers/bootstrap/Tooltip";

interface Props {
  children: string;
  maxLength?: number;
}

const TextExcerpt = ({ children, maxLength = 45 }: Props) => {
  return children.length > maxLength ? (
    <Tooltip content={<div className="text-left">{children}</div>}>
      <span>{children.slice(0, maxLength)}...</span>
    </Tooltip>
  ) : (
    <span>{ children }</span>
  );
};

export default TextExcerpt;
