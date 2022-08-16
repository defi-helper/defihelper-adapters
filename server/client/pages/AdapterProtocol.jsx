import React from "react";
import ReactJson from "react-json-view";
import { ReactJsonWrap } from "../components/ReactJsonWrap";
import * as adaptersGateway from "../common/adapter";
import { useProvider as useEthProvider } from "../common/ether";
import { useProvider as useWavesProvider } from "../common/waves";
import { AdapterModalSteps, AdapterModalComponent } from "../components";
import { useQueryParams } from "../common/useQueryParams";
import { blockchainEnum } from "../common/constants";
import { Button } from "../components/Button";

export function AdapterProtocol(props) {
  const searchParams = useQueryParams();

  const [ethProvider, ethSigner] = useEthProvider();
  const [wavesProvider, wavesSigner] = useWavesProvider();
  const [blockchain, setBlockchain] = React.useState(
    searchParams.get("blockchain") ?? blockchainEnum.ethereum
  );
  const [protocol, setProtocol] = React.useState(null);
  const [currentAdapter, setCurrentAdapter] = React.useState(
    searchParams.get("adapter") ?? ""
  );
  const [contract, setContract] = React.useState(
    searchParams.get("contract") ?? ""
  );
  const [contractReload, setContractReload] = React.useState(false);
  const [contractMetrics, setContractMetrics] = React.useState(null);
  const [wallet, setWallet] = React.useState(searchParams.get("wallet") ?? "");
  const [walletReload, setWalletReload] = React.useState(false);
  const [walletMetrics, setWalletMetrics] = React.useState(null);
  const [actions, setActions] = React.useState(null);
  const [currentAction, setCurrentAction] = React.useState("stake");
  const [actionReload, setActionReload] = React.useState(false);
  const [actionResult, setActionResult] = React.useState(null);
  const [actionSteps, setActionSteps] = React.useState([]);
  const [actionComponent, setActionComponent] = React.useState(null);

  React.useEffect(() => {
    const handler = async () => {
      const protocol = await adaptersGateway.load(props.protocol);
      if (currentAdapter === "") {
        setCurrentAdapter(Object.keys(protocol)[0]);
      }
      setProtocol(protocol);
    };

    handler().catch(console.error);
  }, []);

  const onContractReload = async () => {
    if (protocol === null) return;
    if (contract === "") return;

    setContractReload(true);
    try {
      let metrics = {};
      switch (blockchain) {
        case blockchainEnum.ethereum:
          metrics = await protocol[currentAdapter](ethProvider, contract, {
            blockNumber: "latest",
            signer: ethSigner,
          });
          break;
        case blockchainEnum.waves:
          metrics = await protocol[currentAdapter](wavesProvider, contract, {
            node: await wavesProvider
              .publicState()
              .then(({ network: { server } }) => server),
            signer: wavesSigner,
          });
          break;
        default:
          throw new Error(`Undefined blockchain "${blockchain}"`);
      }
      setContractMetrics(metrics);
    } catch (e) {
      console.error(e);
    }
    setContractReload(false);
  };

  const onWalletReload = async () => {
    if (protocol === null) return;
    if (contract === "") return;
    if (wallet === "") return;

    setWalletReload(true);
    try {
      const [metrics, actions] = await Promise.all([
        contractMetrics.wallet(wallet),
        contractMetrics.actions(wallet),
      ]);
      setWalletMetrics(metrics);
      setActions(actions);
      setCurrentAction(Object.keys(actions)[0]);
    } catch (e) {
      console.error(e);
    }
    setWalletReload(false);
  };

  const onAction = async () => {
    if (!currentAction) return;

    setActionReload(true);
    setActionSteps([]);
    if (actions[currentAction].methods !== undefined) {
      setActionComponent(actions[currentAction]);
      setActionResult(null);
    } else {
      try {
        setActionSteps(actions[currentAction]);
        setActionResult(null);
      } catch (e) {
        console.error(e);
      }
    }
    setActionReload(false);
  };

  if (protocol === null) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container">
      <h2>{props.protocol}</h2>
      <div className="row">
        <div className="column">
          <label>Adapter: </label>
          <select
            value={blockchain}
            onChange={(e) => setBlockchain(e.target.value)}
          >
            {Object.values(blockchainEnum).map((bc) => (
              <option key={bc} value={bc}>
                {bc}
              </option>
            ))}
          </select>
        </div>
        <div className="column">
          <label>Adapter: </label>
          <select
            value={currentAdapter}
            onChange={(e) => setCurrentAdapter(e.target.value)}
          >
            {Object.keys(protocol).map((adapterName) => (
              <option key={adapterName} value={adapterName}>
                {adapterName}
              </option>
            ))}
          </select>
        </div>
        <div className="column">
          <label>Address: </label>
          <input
            type="text"
            placeholder="0x"
            value={contract}
            onChange={(e) => setContract(e.target.value)}
          />
        </div>
        <div className="column">
          <Button onClick={onContractReload} loading={contractReload}>
            Reload
          </Button>
        </div>
      </div>
      {!contractMetrics || (
        <div>
          <ReactJsonWrap>
            <ReactJson
              src={JSON.parse(JSON.stringify(contractMetrics))}
              collapsed={1}
            />
          </ReactJsonWrap>
          <div className="row">
            <div className="column">
              <label>Wallet:</label>
              <input
                type="text"
                placeholder="0x"
                value={wallet}
                onChange={(e) => setWallet(e.target.value)}
              />
            </div>
            <div className="column">
              <Button onClick={onWalletReload} loading={walletReload}>
                Reload
              </Button>
            </div>
          </div>
          {!walletMetrics || (
            <div>
              <ReactJsonWrap>
                <ReactJson
                  src={JSON.parse(JSON.stringify(walletMetrics))}
                  collapsed={1}
                />
              </ReactJsonWrap>
            </div>
          )}
          {!actions || (
            <div>
              <h3>Action</h3>
              <div className="row">
                <div className="column column-90">
                  <label>Action: </label>
                  <select
                    value={currentAction}
                    onChange={(e) => setCurrentAction(e.target.value)}
                  >
                    {Object.keys(actions).map((name) => (
                      <option key={name} value={name}>
                        {name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="column column-10">
                  <Button onClick={onAction} loading={actionReload}>
                    Call
                  </Button>
                </div>
              </div>
            </div>
          )}
          {!actionSteps.length || (
            <div>
              <h3>Action steps</h3>
              <AdapterModalSteps
                steps={actionSteps}
                onAction={setActionResult}
              />
            </div>
          )}
          {!actionComponent || (
            <div>
              <h3>Action component</h3>
              <AdapterModalComponent
                blockchain={blockchain}
                component={actionComponent}
                onAction={setActionResult}
              />
            </div>
          )}
          {actionResult !== null && (
            <pre>
              <code>{JSON.stringify(actionResult, null, 2)}</code>
            </pre>
          )}
        </div>
      )}
    </div>
  );
}
