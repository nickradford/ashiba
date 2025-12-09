import {
  createPrompt,
  useState,
  useKeypress,
  usePrefix,
  isEnterKey,
  isUpKey,
  isDownKey,
  makeTheme,
  useRef,
  useEffect,
  type Theme,
} from "@inquirer/core";
import { type PartialDeep, type Prompt } from "@inquirer/type";
import pc from "picocolors";

type Config = {
  message: string;
  default?: number;
  min?: number;
  max?: number;
  interval?: number;
  theme?: PartialDeep<Theme>;
};

export default createPrompt<number, Config>((config, done) => {
  const {
    default: defaultValue = 0,
    min = Number.MIN_SAFE_INTEGER,
    max = Number.MAX_SAFE_INTEGER,
    interval = 1,
  } = config;
  const theme = makeTheme(config.theme);
  const [status, setStatus] = useState<"idle" | "done">("idle");
  const [value, setValue] = useState(defaultValue);
  const [inputBuffer, setInputBuffer] = useState("");
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const prefix = usePrefix({ status, theme });

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  useKeypress((key) => {
    if (status !== "idle") return;

    if (isEnterKey(key)) {
      setStatus("done");
      done(value);
    } else if (isUpKey(key)) {
      setInputBuffer("");
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      const increment = key.shift ? 10 : interval;
      const newValue = Math.min(value + increment, max);
      setValue(newValue);
    } else if (isDownKey(key)) {
      setInputBuffer("");
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      const decrement = key.shift ? 10 : interval;
      const newValue = Math.max(value - decrement, min);
      setValue(newValue);
    } else if (key.sequence && /^\d$/.test(key.sequence)) {
      const newBuffer = inputBuffer + key.sequence;
      const parsedValue = Number(newBuffer);

      if (parsedValue >= min && parsedValue <= max) {
        setInputBuffer(newBuffer);
        setValue(parsedValue);

        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        timeoutRef.current = setTimeout(() => {
          setInputBuffer("");
        }, 1000);
      }
    }
  });

  const message = theme.style.message(config.message, status);
  let formattedValue = pc.green(String(value));

  if (status === "done") {
    formattedValue = theme.style.answer(String(value));
  }

  let arrows = pc.gray(`\n\n↑↓ +/- • ⏎ select`);

  return `${prefix} ${message} ${formattedValue} ${status === "idle" ? arrows : ""}`;
});
