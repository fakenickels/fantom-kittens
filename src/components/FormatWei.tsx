import {utils} from 'ethers';

export default function FormatWei({wei}: {wei?: number | null}) {
  return (
    <span>
      {wei ? utils.formatEther(wei) : '0'}
    </span>
  );
}