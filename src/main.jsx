import { createRoot } from "react-dom/client";

// Load critical base styles first
import "./index.css";
import "./assets/styles/global.css";

// Then component-specific styles
import "./assets/styles/button.css";
import "./assets/styles/table.css";
import "./assets/styles/tag.css";

// Ant Design customizations last (they override defaults)
import "./assets/styles/ANTD/customAntd.css";
import "./assets/styles/ANTD/inputAntd.css";
import "./assets/styles/ANTD/selectAntd.css";
import "./assets/styles/ANTD/checkboxAntd.css";

import AppRoutes from "./routes/AppRoutes";
import { Toaster } from "react-hot-toast";
import { ThemeProvider } from "./contexts/ThemeContext";

createRoot(document.getElementById("root")).render(
  <ThemeProvider>
    <Toaster position="top-center" />
    <AppRoutes />
  </ThemeProvider>,
);
