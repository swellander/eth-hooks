import { MockProvider } from 'ethereum-waffle';

export const mineBlock = async (mockProvider: MockProvider): Promise<void> => {
  await mockProvider.send('evm_increaseTime', [3600]);
  await mockProvider.send('evm_mine', []);
};

/**
 * #### Summary
 * mine block until the a condition is met or a maximumNumberOfBlocks is reached
 * @param mockProvider
 * @param untilCondition
 * @param maxNumberOfBlocks
 * @returns [success, currentBlockNumber]
 */
export const mineBlockUntil = async (
  mockProvider: MockProvider,
  maxNumberOfBlocks: number,
  untilCondition:
    | ((currentBlockNumber: number) => Promise<boolean>)
    | ((currentBlockNumber: number) => boolean)
    | ((currentBlockNumber: number) => Promise<void>)
): Promise<[success: boolean, currentBlockNumber: number]> => {
  let currentBlockNumber = await mockProvider.getBlockNumber();
  const initialBlockNumber = currentBlockNumber;
  while (!(await untilCondition(currentBlockNumber)) && maxNumberOfBlocks >= currentBlockNumber - initialBlockNumber) {
    await mineBlock(mockProvider);
    currentBlockNumber = await mockProvider.getBlockNumber();
  }
  const success = await untilCondition(currentBlockNumber);
  return [success ?? true, currentBlockNumber];
};
