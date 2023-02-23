import { useState } from 'react';

const useFormValue = (initialValue: any) => {
  const [value, setValue] = useState(initialValue);

  const onValueChange = (e: any) => {
    setValue(e.target.value);
  }

  return [value, onValueChange]
}

export default useFormValue;
