import { useEffect, useState } from "react";
import { set, type StringInputProps } from "sanity";
import { Box, Button, Flex, TextInput } from "@sanity/ui";
import { DEFAULT_COLOURS, isHex, type ColourRole } from "../schemas/lib/colours";

/**
 * A colour picker with the code beside it. Click the swatch for the picker;
 * or type or paste a code such as #075a7d. "Use original" puts back the
 * site's original colour for this part.
 */
export function ColourInput(props: StringInputProps) {
  const { value, onChange, elementProps, path } = props;
  const role = String(path[path.length - 1]) as ColourRole;
  const original = DEFAULT_COLOURS[role] ?? "#000000";
  const current = isHex(value) ? value.trim().toLowerCase() : original;
  const [text, setText] = useState(current);

  useEffect(() => setText(current), [current]);

  const commit = (next: string) => {
    const v = next.trim().toLowerCase();
    if (isHex(v) && v !== current) onChange(set(v));
  };

  return (
    <Flex gap={2} align="center">
      <input
        type="color"
        value={current}
        onChange={(e) => commit(e.currentTarget.value)}
        aria-label="Open the colour picker"
        style={{
          width: 72,
          height: 44,
          padding: 2,
          border: "1px solid var(--card-border-color, #8a8a8a)",
          borderRadius: 4,
          background: "transparent",
          cursor: "pointer",
          flex: "none",
        }}
      />
      <Box flex={1}>
        <TextInput
          {...elementProps}
          value={text}
          onChange={(e) => {
            const v = e.currentTarget.value;
            setText(v);
            commit(v);
          }}
          onBlur={(e) => {
            elementProps.onBlur(e);
            if (!isHex(text)) setText(current);
          }}
        />
      </Box>
      {current !== original && (
        <Button mode="ghost" text="Use original" onClick={() => onChange(set(original))} />
      )}
    </Flex>
  );
}
