import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const initialSupply = 500_000_000n * 10n ** 18n; // Use BigInt for large numbers
const totalTokensForSale = 125_000_000n * 10n ** 18n;
const pusdTokenAddress = "0xDd7639e3920426de6c59A1009C7ce2A9802d0920";
const rate = 100;

const LogposeToken = buildModule("LogposeTokenModule", (m) => {
  const token = m.contract("LogPoseToken", [initialSupply]);
  return { token };
});

const LogposeIDO = buildModule("LogposeIDOModule", (m) => {
  const { token } = m.useModule(LogposeToken);
  const ido = m.contract("LogPoseIDO", [token, pusdTokenAddress, rate, totalTokensForSale]);
  return { ido };
});

export default buildModule("DeployModule", (m) => {
  const { token } = m.useModule(LogposeToken);
  const { ido } = m.useModule(LogposeIDO);

  m.call(token, "approve", [ido, totalTokensForSale]);

  return { token, ido };
});