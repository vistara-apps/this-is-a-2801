# Base Blockchain Integration Documentation

## Overview

Beat Weaver integrates with the Base blockchain for handling micropayments and tipping. Base is an Ethereum L2 (Layer 2) solution that provides fast and low-cost transactions, making it ideal for the micro-transaction model used in Beat Weaver.

## Base RPC Endpoint

```
https://mainnet.base.org
```

## Authentication

Authentication is handled through wallet connections using WalletConnect, Rainbow Kit, or other Web3 wallet providers.

## Integration Components

### 1. Wallet Connection

Beat Weaver uses Rainbow Kit for wallet connection, which supports various wallets including MetaMask, Coinbase Wallet, and WalletConnect-compatible wallets.

**Implementation:**

```tsx
import {
  getDefaultConfig,
  RainbowKitProvider,
} from '@rainbow-me/rainbowkit';
import { WagmiProvider } from 'wagmi';
import { base } from 'wagmi/chains';

const wagmiConfig = getDefaultConfig({
  appName: "Beat Weaver",
  projectId: "YOUR_PROJECT_ID",
  chains: [base],
});

// In your app component
<WagmiProvider config={wagmiConfig}>
  <RainbowKitProvider>
    <App />
  </RainbowKitProvider>
</WagmiProvider>
```

### 2. Payment Processing

Beat Weaver uses a combination of on-chain transactions and off-chain payment processing to handle micropayments for services like stem separation and beat generation.

**Payment Flow:**

1. User initiates a payment for a service
2. Wallet signs a transaction
3. Transaction is submitted to the Base blockchain
4. Service is provided once transaction is confirmed

### 3. Tipping System

The tipping system allows users to send small amounts of cryptocurrency (USDC) to remix creators as a form of support.

**Tipping Flow:**

1. User clicks a tip button on a remix
2. Wallet prompts for transaction approval
3. Transaction is submitted to the Base blockchain
4. Tip amount is credited to the creator's account

## Smart Contract Interactions

### USDC Token Contract

For tipping and payments, Beat Weaver interacts with the USDC token contract on Base.

**USDC Contract Address on Base:**
```
0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913
```

**Common Interactions:**

1. **Check Balance:**
   ```solidity
   function balanceOf(address account) external view returns (uint256);
   ```

2. **Transfer USDC:**
   ```solidity
   function transfer(address to, uint256 amount) external returns (bool);
   ```

3. **Approve Spending:**
   ```solidity
   function approve(address spender, uint256 amount) external returns (bool);
   ```

### Beat Weaver Payment Contract

Beat Weaver uses a custom payment contract to handle service payments and tipping.

**Contract Functions:**

1. **Pay for Service:**
   ```solidity
   function payForService(
     string serviceId,
     uint256 amount,
     address serviceProvider
   ) external returns (bool);
   ```

2. **Send Tip:**
   ```solidity
   function sendTip(
     address creator,
     uint256 amount,
     string remixId
   ) external returns (bool);
   ```

3. **Get Payment History:**
   ```solidity
   function getPaymentHistory(address user) external view returns (Payment[] memory);
   ```

## Transaction Fees

Base blockchain has significantly lower transaction fees compared to Ethereum mainnet, making it suitable for micropayments:

- Average transaction fee: ~$0.001-$0.01
- Transaction confirmation time: ~2 seconds

## Error Handling

Common errors when interacting with the Base blockchain:

1. **Insufficient Balance:**
   - Error Code: 4001
   - Solution: Ensure the user has sufficient USDC and ETH (for gas) in their wallet

2. **User Rejected Transaction:**
   - Error Code: 4001
   - Solution: Inform the user that they need to approve the transaction in their wallet

3. **Network Congestion:**
   - Error Code: -32010
   - Solution: Implement a retry mechanism with increasing gas price

4. **Contract Execution Error:**
   - Error Codes: Various
   - Solution: Check contract logs for specific error messages

## Implementation in Beat Weaver

In Beat Weaver, the Base blockchain integration is primarily used for:

1. Micropayments for AI services (stem separation, beat generation)
2. Tipping system for community remixes
3. Storing transaction history for users

The implementation can be found in:
- `src/hooks/usePaymentContext.ts`
- `src/services/paymentService.ts`
- `src/components/TipButton.tsx`
- `src/components/PaymentModal.tsx`

## Testing

For testing purposes, Beat Weaver can connect to the Base Goerli testnet:

```
https://goerli.base.org
```

Test USDC can be obtained from the Base Goerli Faucet.

