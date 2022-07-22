async function getFees() {
  let response = await fetch('https://www.etherchain.org/api/gasPriceOracle');
  return response.text();
}

module.exports.onRpcRequest = async ({ origin, request }) => {
  switch (request.method) {
    case 'hello':
      const fees = JSON.parse(await getFees());
      const baseFee = parseFloat(fees.currentBaseFee);
      const minimum = Math.ceil(baseFee + parseFloat(fees.safeLow));
      const average = Math.ceil(baseFee + parseFloat(fees.standard));
      const fastest = Math.ceil(baseFee + parseFloat(fees.fastest));
      return wallet.request({
        method: 'snap_confirm',
        params: [
          {
            prompt: `Hello, ${origin}!`,
            description:
              'This custom confirmation is just for display purposes.',
            textAreaContent:
              `Base Fee: ${baseFee}\n`+
              `Minimum Fee: ${minimum}\n`+
              `Average Fee: ${average}\n`+
              `Fastest Fee: ${fastest}\n`
          },
        ],
      });
    default:
      throw new Error('Method not found.');
  }
};
