import { Input } from "@rebass/forms";
import { utils } from "ethers";

export default function InputWei({ value, onChange, ...props }: any) {
  return (
    <Input
      value={utils.formatEther(value)}
      onChange={(event) => {
        const newValue = Number(event.target.value);
        onChange(utils.parseEther(newValue.toString()))
      }}
      {...props}
    />
  );
}
