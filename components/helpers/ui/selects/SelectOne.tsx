import MultiSelect, { MultiSelectProps, Index } from "./MultiSelect";

export interface Props<T extends Index> extends Omit<MultiSelectProps<T>, "selected"> {
  selected: T | null;
}

const SelectOne = <T extends Index>({
  selected,
  closeOnOptionClick = true,
  ...restProps
}: Props<T>) => {
  const adaptedSelected = selected != null ? [selected] : [];
  return (
    <MultiSelect
      {...restProps}
      selected={adaptedSelected}
      closeOnOptionClick={closeOnOptionClick}
    />
  );
};

export default SelectOne;
