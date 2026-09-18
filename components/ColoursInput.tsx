import { set, type ObjectInputProps } from "sanity";
import { Box, Button, Card, Flex, Stack, Text } from "@sanity/ui";
import { DEFAULT_COLOURS, resolveColours, type ColourRole } from "../schemas/lib/colours";
import { ColourPreview } from "./ColourPreview";
import { ROLE_LABELS } from "./colourRoles";

const Swatch = ({ hex }: { hex: string }) => (
  <span
    style={{
      display: "inline-block",
      width: 14,
      height: 14,
      borderRadius: 3,
      background: hex,
      border: "1px solid rgba(127,127,127,0.5)",
      verticalAlign: "-2px",
      margin: "0 4px",
    }}
  />
);

/**
 * The colour fields with a live preview above them. Any colour can be used:
 * where text on it would be hard to read, a warning says what, and offers the
 * nearest shade that reads clearly. Nothing here blocks publishing.
 */
export function ColoursInput(props: ObjectInputProps) {
  const chosen = (props.value ?? {}) as Partial<Record<ColourRole, string>>;
  const { colours, checks } = resolveColours(chosen);
  const roles = Object.keys(DEFAULT_COLOURS) as ColourRole[];
  const warnings = roles.filter((role) => !checks[role].ok);
  const isOriginal = roles.every((role) => colours[role] === DEFAULT_COLOURS[role]);

  return (
    <Stack space={4}>
      <ColourPreview colours={colours} />

      {warnings.map((role) => {
        const check = checks[role];
        return (
          <Card key={role} tone="caution" padding={3} radius={2} border>
            <Flex gap={3} align="center" wrap="wrap">
              <Box flex={1} style={{ minWidth: 220 }}>
                <Stack space={2}>
                  <Text size={1} weight="semibold">
                    {ROLE_LABELS[role]}: may be hard to read
                  </Text>
                  <Text size={1} muted>
                    {check.problems.join(", ")}.{" "}
                    {check.clearedBy ? (
                      <>This colour is fine on its own: fixing {ROLE_LABELS[check.clearedBy]} clears this.</>
                    ) : (
                      <>
                        You can keep this colour, or use the nearest shade that reads clearly:
                        <Swatch hex={check.suggestion} />
                        {check.suggestion}
                      </>
                    )}
                  </Text>
                </Stack>
              </Box>
              {!check.clearedBy && (
                <Button
                  mode="ghost"
                  text="Use suggested shade"
                  onClick={() => props.onChange(set(check.suggestion, [role]))}
                />
              )}
            </Flex>
          </Card>
        );
      })}

      {props.renderDefault(props)}

      {!isOriginal && (
        <Flex justify="flex-end">
          <Button
            mode="ghost"
            tone="critical"
            text="Put all colours back to the originals"
            onClick={() => props.onChange(set({ _type: "siteColours", ...DEFAULT_COLOURS }))}
          />
        </Flex>
      )}
    </Stack>
  );
}
