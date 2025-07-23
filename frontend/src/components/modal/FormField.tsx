interface FormFieldProps {
  index: number;
  placeholder?: string;
  inputValue: string[];
  setInputValue: (newValues: string[]) => void;
  valueBefore?: string[];
  isInput?: boolean;
}

export const FormField: React.FC<FormFieldProps> = ({
  index,
  placeholder = "ここに入力",
  inputValue,
  setInputValue,
  valueBefore,
  isInput = true,
}) => {
  const commonClass = "w-full px-3 py-1.5 border rounded-lg border-gray-300 text-sm text-slate-800";

  return (
    isInput ? (
      <input
        type="text"
        className={commonClass}
        placeholder={placeholder}
        value={inputValue[index] || ""}
        onChange={(e) => {
          const newInputValue = [...inputValue];
          newInputValue[index] = e.target.value;
          setInputValue(newInputValue);
        }}
      />
    ) : (
      <p className={commonClass}>{valueBefore?.[index]}</p>
    )
  );
};