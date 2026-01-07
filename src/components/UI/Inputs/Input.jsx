import { Input as AntInput } from "antd";
import { useTheme } from "../contexts/ThemeContext";

export default function Input({ className = "", ...rest }) {
  const { theme } = useTheme();
  return (
    <AntInput
      {...rest}
      className={`rounded-lg border-gray-300 focus:!border-primary ${className}`}
      style={{
        fontFamily: theme.typography.fontFamily,
        color: theme.colors.text,
      }}
    />
  );
}
