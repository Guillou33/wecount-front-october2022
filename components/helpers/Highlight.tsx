import styles from "@styles/helpers/highlight.module.scss";

interface Props {
  search: string;
  className?: string;
  style?: React.CSSProperties;
  children: string;
}

const Highlight = ({
  search,
  children,
  className = styles.highlight,
  style,
}: Props) => {
  const findIndex = children.toLowerCase().indexOf(search.toLowerCase());
  const beforeMatch = children.slice(0, findIndex);
  const theMatch = children.slice(findIndex, findIndex + search.length);
  const afterMatch = children.slice(findIndex + search.length);

  return search !== "" && findIndex !== -1 ? (
    <>
      {beforeMatch}
      <mark className={className} style={style}>
        {theMatch}
      </mark>
      {afterMatch}
    </>
  ) : (
    <>{children}</>
  );
};

export default Highlight;
