import React from "react";

/**
 * @param {{
 * 	steps: Array<{
 * 		name: string;
 * 		info: () => Promise<{
 * 			description: string;
 * 			inputs: Array<{placeholder: string, value: string}>;
 * 		}>;
 * 		can: (...args: any[]) => Promise<boolean | Error>;
 * 		send: (...args: any[]) => Promise<{tx: any, ...args: any[]}>;
 * 	}>;
 * 	onAction: (result: string | object) => void;
 * }} props
 */
export function AdapterModalSteps({ steps, onAction }) {
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [info, setInfo] = React.useState(null);
  const [inputs, setInputs] = React.useState([]);

  const onInputChange = (inputIndex, newValue) => {
    setInputs(
      inputs.reduce(
        (result, value, i) => [...result, i === inputIndex ? newValue : value],
        []
      )
    );
  };

  const onCanClick = async () => {
    const step = steps[currentIndex];
    if (!step) return;

    const can = await step.can.apply(step, inputs);
    onAction(can instanceof Error ? can.message : `${can}`);
  };

  const onSendClick = async () => {
    const step = steps[currentIndex];
    if (!step) return;

    const send = await step.send.apply(step, inputs);
    onAction(send);
  };

  React.useEffect(async () => {
    const step = steps[currentIndex];
    if (!step) return;

    const stepInfo = await step.info();
    setInputs(
      Array.from(new Array((stepInfo.inputs ?? []).length).values()).map(
        (_, i) => stepInfo.inputs[i].value ?? ""
      )
    );
    setInfo(stepInfo);
  }, [currentIndex]);

  return (
    <div>
      <div className="row">
        {steps.map(({ name }, i) => (
          <div
            style={{
              cursor: "pointer",
              backgroundColor: i === currentIndex ? "#eee" : "",
            }}
            className="column"
            key={i}
            onClick={() => setCurrentIndex(i)}
          >
            {name}
          </div>
        ))}
      </div>
      {info && (
        <div>
          <p>{info.description}</p>
          <div>
            {(info.inputs ?? []).map(({ placeholder }, i) => (
              <div key={i}>
                {placeholder !== "" && <label>{placeholder}:</label>}
                <input
                  type="text"
                  placeholder={placeholder}
                  value={inputs[i] ?? ""}
                  onChange={(e) => onInputChange(i, e.target.value)}
                />
              </div>
            ))}
          </div>
          <div>
            <button onClick={onCanClick}>Can</button>
            <button onClick={onSendClick}>Send</button>
          </div>
        </div>
      )}
    </div>
  );
}
