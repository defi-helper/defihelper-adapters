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
 * @param {(...args: any) => Promise<boolean>} can
 * @param {(...args: any) => Promise<{tx}>} send
 */
const tab = (name, info, can, send) => ({ name, info, can, send });

module.exports = {
  input,
  tab,
};
