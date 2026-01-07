import { Tag as AntTag } from "antd";
import { useTheme } from "../contexts/ThemeContext";

export default function Tag({ children, className = "", ...rest }) {
  const { theme } = useTheme();
  return (
    <AntTag
      {...rest}
      className={`!border-none !bg-primary !text-white font-medium rounded-md px-3 py-1 ${className}`}
      style={{
        fontFamily: theme.typography.fontFamily,
      }}
    >
      {children}
    </AntTag>
  );
}
