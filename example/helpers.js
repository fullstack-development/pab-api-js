const keypress = async () => {
  console.log('Press any key to continue');
  process.stdin.setRawMode(true);
  return new Promise((resolve) =>
    process.stdin.once('data', () => {
      process.stdin.setRawMode(false);
      resolve();
    })
  );
};

const printEmptyLines = (linesNumber = 1) => {
  console.log(
    `
  `.repeat(linesNumber - 1)
  );
};

exports.makeDelay = (ms = 2000) => new Promise((resolve) => setTimeout(resolve, ms));

exports.printTitle = async (text) => {
  console.log(`

  ======================================================
                      ${text}
  ======================================================

  `);
  await exports.makeDelay();
};

exports.printBlock = async (title, callback) => {
  console.log(`
  ______________________________________________________
  
        ${title}

  `);
  await callback();

  printEmptyLines(3);
  await exports.makeDelay();
  await keypress();
};

exports.printEndpoint = (endpointName, body) => {
  printEmptyLines();
  console.log('endpoint:', endpointName);
  console.log('body:', JSON.stringify(body));
  printEmptyLines(2);
};

exports.getBody = (endpointName, args, symbol) => {
  const { tokenA, tokenB, amountA, amountB, tokens } = args;
  switch (endpointName) {
    case 'create':
      return {
        cpAmountA: amountA,
        cpAmountB: amountB,
        cpCoinA: { unAssetClass: [symbol, { unTokenName: tokenA }] },
        cpCoinB: { unAssetClass: [symbol, { unTokenName: tokenB }] },
      };
    case 'swap':
      return {
        spAmountA: amountA,
        spAmountB: 0,
        spCoinA: { unAssetClass: [symbol, { unTokenName: tokenA }] },
        spCoinB: { unAssetClass: [symbol, { unTokenName: tokenB }] },
      };
    case 'add':
      return {
        apAmountA: amountA,
        apAmountB: amountB,
        apCoinA: { unAssetClass: [symbol, { unTokenName: tokenA }] },
        apCoinB: { unAssetClass: [symbol, { unTokenName: tokenB }] },
      };
    case 'remove':
      return {
        rpDiff: tokens,
        rpCoinA: { unAssetClass: [symbol, { unTokenName: tokenA }] },
        rpCoinB: { unAssetClass: [symbol, { unTokenName: tokenB }] },
      };
    case 'close':
      return {
        clpCoinA: { unAssetClass: [symbol, { unTokenName: tokenA }] },
        clpCoinB: { unAssetClass: [symbol, { unTokenName: tokenB }] },
      };
    default:
      throw new Error('Incorrect endpoint name.');
  }
};
