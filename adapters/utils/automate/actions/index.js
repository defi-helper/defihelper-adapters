const { ethers } = require('../../../lib');
const ProxyFactoryABI = require('../../abi/dfh/proxyFactory.json');

/**
 * @typedef {{
 * 	placeholder: string;
 * 	value: string;
 * }} Input
 */
/**
 * @param {{
 * 	placeholder?: string;
 * 	value?: string;
 * }} args
 * @returns {Input}
 */
const input = ({ placeholder = '', value = '' }) => ({ placeholder, value });

/**
 * @typedef {{
 * 	description: string;
 * 	inputs?: Input[];
 * }} TabInfo
 */
/**
 * @typedef {{
 *  name: string;
 * 	info: () => Promise<TabInfo>;
 * 	can: (...args: any) => Promise<boolean>;
 * 	send: (...args: any) => Promise<{tx: any}>;
 * }} Tab
 */
/**
 * @param {string} name
 * @param {() => Promise<TabInfo>} info
 * @param {(...args: any) => Promise<boolean | Error>} can
 * @param {(...args: any) => Promise<{tx}>} send
 */
const tab = (name, info, can, send) => ({ name, info, can, send });

const ethereum = {
  proxyDeploy: async (signer, factoryAddress, prototypeAddress, inputs) => {
    const proxyFactory = new ethers.Contract(factoryAddress, ProxyFactoryABI, signer);
    const tx = await proxyFactory.create(prototypeAddress, inputs);

    return {
      tx,
      wait: tx.wait.bind(tx),
      getAddress: async () => {
        const receipt = await tx.wait();
        const proxyCreatedEvent = receipt.logs[0];
        const proxyAddressBytes = proxyCreatedEvent.topics[2];
        const [proxyAddress] = ethers.utils.defaultAbiCoder.decode(['address'], proxyAddressBytes);

        return proxyAddress;
      },
    };
  },
};

module.exports = {
  ethereum,
  input,
  tab,
};
