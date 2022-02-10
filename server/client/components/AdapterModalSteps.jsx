import React from "react";
import { Remarkable } from "remarkable";
import RemarkableReactRenderer from "remarkable-react";

const md = new Remarkable();
md.renderer = new RemarkableReactRenderer();

function TextInput({ input: { placeholder }, value, onChange }) {
  return (
    <div>
      {placeholder !== "" && <label>{placeholder}:</label>}
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}

function SelectInput({ input: { placeholder, options }, value, onChange }) {
  return (
    <div>
      {placeholder !== "" && <label>{placeholder}:</label>}
      <select
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        {options.map(({ value, label }) => (
          <option key={label} value={value}>
            {label}
          </option>
        ))}
      </select>
    </div>
  );
}

/**
 * @param {{
 * 	steps: Array<{
 * 		name: string;
 * 		info: () => Promise<{
 * 			description: string;
 * 			inputs: Array<
 *        {type: 'text', placeholder: string, value: string}
 *        | {type: 'select', placeholder: string, value: string, options: Array<{value: string, label: string}>}
 *      >;
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

  React.useEffect(() => {
    const handler = async () => {
      const step = steps[currentIndex];
      if (!step) return;

      const stepInfo = await step.info();
      setInputs(
        Array.from(new Array((stepInfo.inputs ?? []).length).values()).map(
          (_, i) => stepInfo.inputs[i].value ?? ""
        )
      );
      setInfo(stepInfo);
    };

    handler().catch(console.error);
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
          {md.render(info.description)}
          <div>
            {(info.inputs ?? []).map((input, i) => {
              const Component = {
                text: TextInput,
                select: SelectInput,
              }[input.type];

              return (
                <Component
                  key={i}
                  input={input}
                  value={inputs[i]}
                  onChange={onInputChange.bind(null, i)}
                />
              );
            })}
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
