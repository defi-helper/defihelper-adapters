const bn = require('bignumber.js');
const networks = require('@defihelper/networks/contracts.json');
const { network } = require('hardhat');

let totalCost = new bn(0);

function logDeploy({ contractName, args, receipt }) {
  if (network.name === 'hardhat') return;

  totalCost = totalCost.plus(receipt.gasUsed.toString());

  console.log(
    `=== new ${contractName}(${args.join(', ')}) ===
> contract address: ${receipt.contractAddress}
> block number: ${receipt.blockNumber}
> tx hash: ${receipt.transactionHash}
> deployer: ${receipt.from}
> gas used: ${receipt.gasUsed.toString()}
> total cost: ${totalCost
      .multipliedBy(network.config.gasPrice || 1)
      .div(new bn(10).pow(18))
      .toFormat()} ETH
`
  );
}

function logExecute(contract, method, args, receipt) {
  if (network.name === 'hardhat') return;

  totalCost = totalCost.plus(receipt.gasUsed.toString());

  console.log(
    `=== ${contract}.${method}(${args.join(', ')}) ===
> block number: ${receipt.blockNumber}
> tx hash: ${receipt.transactionHash}
> deployer: ${receipt.from}
> gas used: ${receipt.gasUsed.toString()}
> total cost: ${totalCost
      .multipliedBy(network.config.gasPrice || 1)
      .div(new bn(10).pow(18))
      .toFormat()} ETH
`
  );
}

function migration(handler) {
  return async ({ getNamedAccounts, deployments, getChainId, getUnnamedAccounts }) => {
    const { deployer } = await getNamedAccounts();

    return handler({
      getNamedAccounts,
      getChainId,
      getUnnamedAccounts,
      deployments,
      utils: {
        dfhNetwork: () => networks[network.config.chainId.toString()],
        get: (name) => {
          return deployments.get(name);
        },
        deploy: (name, options = {}) => {
          return deployments
            .deploy(name, {
              ...options,
              from: options.from || deployer,
            })
            .then((res) => {
              if (res.newlyDeployed) {
                logDeploy(res);
              } else {
                console.log(`=== ${name}(${res.args.join(', ')}) already deployed ===`);
              }
            });
        },
        read: (name, options, method, ...args) => {
          return deployments.read.apply(deployments, [name, options, method, ...args]);
        },
        execute: (name, options, method, ...args) => {
          return deployments.execute
            .apply(deployments, [
              name,
              {
                ...options,
                from: options.from || deployer,
              },
              method,
              ...args,
            ])
            .then((receipt) => logExecute(name, method, args, receipt));
        },
      },
    });
  };
}

module.exports = {
  totalCost,
  migration,
};
