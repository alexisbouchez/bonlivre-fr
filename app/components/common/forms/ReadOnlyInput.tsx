interface ReadOnlyInputProps {
  name?: string;
  value?: string | number;
}

const ReadOnlyInput: React.FC<ReadOnlyInputProps> = ({ name, value }) => {
  if (!value) return null;

  return <input type="hidden" name={name} value={value} readOnly hidden />;
};

export default ReadOnlyInput;
