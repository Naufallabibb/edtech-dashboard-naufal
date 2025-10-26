import { Button } from "./ui/button";
import { useTheme } from "../hooks/use-theme";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCloudSun, faCloudMoon } from "@fortawesome/free-solid-svg-icons";

export function ModeToggle() {
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      className="h-9 w-9 relative"
    >
      <FontAwesomeIcon
        icon={faCloudSun}
        className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 text-yellow-500 transition-all dark:-rotate-90 dark:scale-0"
      />
      
      <FontAwesomeIcon
        icon={faCloudMoon}
        className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 text-blue-400 transition-all dark:rotate-0 dark:scale-100"
      />

      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
