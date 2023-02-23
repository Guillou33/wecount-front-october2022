import { useRef, useEffect } from "react";
import SearchInput, {
  Props as SearchInputProps,
} from "@components/helpers/form/field/SearchInput";

interface Props extends Omit<SearchInputProps, "onChange"> {
  value: string;
  onStartTyping?: () => void;
  onEndTyping?: (value: string) => void;
  bufferTimeMs?: number;
}

const BufferedSearchInput = ({
  value,
  onStartTyping,
  onEndTyping,
  bufferTimeMs = 333,
  ...props
}: Props) => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const isTyping = useRef(false);
  const typingTimeout = useRef<NodeJS.Timeout | null>(null);

  function setInputValue(value: string) {
    if (inputRef.current != null) {
      inputRef.current.value = value;
    }
  }

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  return (
    <SearchInput
      ref={inputRef}
      {...props}
      value={undefined}
      onChange={e => {
        if (!isTyping.current) {
          isTyping.current = true;
          onStartTyping?.();
        }
        if (typingTimeout.current != null) {
          clearTimeout(typingTimeout.current);
        }
        typingTimeout.current = setTimeout(() => {
          onEndTyping?.(inputRef.current?.value ?? "");
          isTyping.current = false;
        }, bufferTimeMs);

        setInputValue(e.target.value);
      }}
    />
  );
};

export default BufferedSearchInput;
