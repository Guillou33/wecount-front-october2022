import { Index } from "./MultiSelect";
import Option, { OptionProps } from "./Option";
import CheckboxInput from "@components/helpers/ui/CheckboxInput";

const CheckboxOption = <T extends Index>({
  children,
  ...props
}: OptionProps<T>) => {
  return (
    <Option {...props}>
      <CheckboxInput
        checked={
          props.isSelected !== undefined
            ? props.isSelected
            : props.selected.includes(props.value)
        }
        id=""
        onChange={() => {}}
      >
        {children}
      </CheckboxInput>
    </Option>
  );
};

export default CheckboxOption;
