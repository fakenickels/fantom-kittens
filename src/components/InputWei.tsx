import { Input, Label } from "@rebass/forms";
import { Box, Flex } from "rebass";
import Button from "../../components/Button";
import { BigNumber, utils } from "ethers";

export default function InputWei({ value, onChange, maxValue, ...props }: any) {
  return (
    <Flex
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      my="2em"
    >
      <Label htmlFor="amount-to-stake" fontSize="16px">
        Amount
      </Label>
      <Input
        inputMode="decimal"
        title="Token Amount"
        autoComplete="off"
        autoCorrect="off"
        // text-specific options
        type="text"
        pattern="^[0-9]*[.,]?[0-9]*$"
        placeholder={"0.0"}
        min={0}
        minLength={1}
        maxLength={79}
        value={value}
        onChange={(event) => {
          onChange(event.target.value.replace(/,/g, "."));
        }}
        {...props}
      />

      <Box>
        {[10, 25, 50, 75, 100].map((v) => {
          const fractionalValue = utils.formatUnits(
            BigNumber.from(maxValue).mul(BigNumber.from(v)).div(100).toString(),
            18
          );
          return (
            <Button
              key={v}
              className={`h ${
                fractionalValue === value && Number(value) !== 0
                  ? "bg-green-500"
                  : ""
              }`}
              onClick={() => {
                // calls on change with percentage v
                onChange(fractionalValue);
              }}
            >
              {v}%
            </Button>
          );
        })}
      </Box>
    </Flex>
  );
}
