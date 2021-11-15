/** @jsx jsx */
import { jsx } from '@emotion/react';
import {
  createIcons,
  onHandleValue,
  radioButtonGroupOptions,
  selectOptionsStandard,
  selectOptionsLong,
  style,
  toolButtonGroupOptions,
} from './ui.setup';
import { AbstractButton } from '../../ui/components/abstractButton';
import { HBoxLayout, VBoxLayout } from '../../ui/layout/box';
import { Icon } from '../../ui/components/icon';
import { Label } from '../../ui/components/label';
import { PushButton } from '../../ui/components/pushButton';
import { CheckBox } from '../../ui/components/checkbox';
import { RadioButton } from '../../ui/components/radioButton';
import { RadioButtonGroup } from '../../ui/components/radioButtonGroup';
import { ToolButtonGroup } from '../../ui/components/toolButtonGroup';
import { TextField, InputKeyEvent } from '../../ui/components/textfield';
import {
  NumericInput,
  numericKeyFilter,
} from '../../ui/components/numericInput';
import { Select } from '../../ui/components/select';

let selectOpenCount = 0;

export function App() {
  return (
    <div css={style}>
      <div className="hsplit">
        <div className="row">
          <Label text="Label Enabled" />
          <Label
            text="Label Disabled"
            enabled={false}
            onClick={() => console.log('Should not be clicked!')}
          />
          <Label
            text="Label Link"
            link={true}
            onClick={() => console.log('Clicked!')}
          />
          <Label
            text="Label Link Disabled"
            link={true}
            enabled={false}
            onClick={() => console.log('Should not be clicked!')}
          />
        </div>
        <div className="row">
          <Icon src="#tick" width={32} />
          <Icon src="img/test.jpg" width={32} border={true} />
        </div>
        <div className="row">
          <div className="border">
            <HBoxLayout>{createIcons()}</HBoxLayout>
          </div>
        </div>
        <div className="row">
          <div className="border">
            <VBoxLayout>{createIcons()}</VBoxLayout>
          </div>
        </div>
      </div>
      <div className="hsplit">
        <div className="row">
          <AbstractButton isRound={true}></AbstractButton>
          <AbstractButton enabled={false}></AbstractButton>
          <AbstractButton canToggle={true}></AbstractButton>
          <AbstractButton canToggle={true} isToggled={true}></AbstractButton>
        </div>
        <div className="row">
          <PushButton onClick={() => console.log('Clicked!')} label="Enabled" />
          <PushButton
            onClick={() => console.log('Should not be clicked!')}
            label="Disabled"
            enabled={false}
          />
          <PushButton label="With Icon" icon="img/test.jpg" iconWidth={20} />
          <PushButton
            label="Toggle Enabled"
            canToggle={true}
            isToggled={true}
            onToggled={(isToggled: boolean) =>
              console.log(`Is ${isToggled ? '' : 'Not '}Toggled!`)
            }
          />
          <PushButton
            label="Toggle Disabled"
            enabled={false}
            canToggle={true}
            onClick={() => console.log('Should not be clicked!')}
          />
        </div>
      </div>
      <div className="hsplit">
        <div className="row">
          <PushButton
            icon="#record"
            isRound={true}
            iconWidth={16}
            canToggle={true}
          />
          <PushButton icon="#stop" isRound={true} iconWidth={16} />
          <PushButton icon="#prev-frame" isRound={true} iconWidth={16} />
          <PushButton
            icon="#play"
            isRound={true}
            iconWidth={16}
            canToggle={true}
            isToggled={true}
          />
          <PushButton
            icon="#pause"
            isRound={true}
            iconWidth={16}
            canToggle={true}
          />
          <PushButton icon="#next-frame" isRound={true} iconWidth={16} />
        </div>
        <div className="row">
          <CheckBox />
          <CheckBox enabled={false} />
          <CheckBox style={'tick'} />
          <CheckBox
            label="Click!"
            name="clickableCheck"
            value={'foo!'}
            onToggled={(isToggled: boolean, name: string, value: any) =>
              console.log(
                `${name} is ${
                  isToggled ? 'toggled' : 'un-toggled'
                } with value "${value}"`
              )
            }
          />
          <CheckBox label="Left" labelPosition="left" />
          <CheckBox label="Right" labelPosition="right" />
          <CheckBox label="Bottom" labelPosition="bottom" />
          <CheckBox label="Top" labelPosition="top" />
        </div>
      </div>
      <div className="row">
        <RadioButton />
        <RadioButton label="Disabled" enabled={false} />
        <RadioButton label="Click!" onToggled={() => console.log('Toggled!')} />
        <RadioButton label="Left" labelPosition="left" />
        <RadioButton label="Right" labelPosition="right" />
        <RadioButton label="Bottom" labelPosition="bottom" />
        <RadioButton label="Top" labelPosition="top" />
      </div>
      <div className="row">
        <RadioButtonGroup
          selectedValue={2}
          options={radioButtonGroupOptions}
          onChange={onHandleValue('RadioGroup.onChange')}
        />
        <RadioButtonGroup
          options={radioButtonGroupOptions}
          labelPosition="left"
          onChange={onHandleValue('RadioGroup.onChange')}
        />
        <RadioButtonGroup
          options={radioButtonGroupOptions}
          labelPosition="top"
          onChange={onHandleValue('RadioGroup.onChange')}
        />
        <RadioButtonGroup
          enabled={false}
          options={radioButtonGroupOptions}
          selectedValue={3}
          labelPosition="bottom"
          onChange={onHandleValue('RadioGroup.onChange')}
        />
        <div className="col">
          <RadioButtonGroup
            options={radioButtonGroupOptions}
            direction="horizontal"
            labelPosition="left"
            onChange={onHandleValue('RadioGroup.onChange')}
          />
          <RadioButtonGroup
            options={radioButtonGroupOptions}
            direction="horizontal"
            labelPosition="right"
            onChange={onHandleValue('RadioGroup.onChange')}
          />
        </div>
      </div>
      <div className="row">
        <ToolButtonGroup
          options={toolButtonGroupOptions}
          onClick={(name: string) => console.log('Tool', name)}
        />
      </div>
      <div className="row">
        <TextField
          placeholder="Type some text..."
          onChange={onHandleValue('TextField.onChange')}
          onAccept={onHandleValue('TextField.onAccept')}
          onFocus={() => console.log('TextField.onFocus')}
          onBlur={() => console.log('TextField.onBlur')}
        />
        <TextField
          placeholder="KeyDown (no 'a'!)..."
          onKeyDown={(e: InputKeyEvent) => {
            const { key } = e;
            if (key === 'a') {
              console.log('TextField.onKeyDown but No press "a"!');
              return e.preventDefault();
            }
            onHandleValue('TextField.onKeyDown')(key);
          }}
          onAccept={onHandleValue('TextField.onAccept')}
        />
        <TextField
          placeholder="Filtered (numeric only)..."
          onKeyFilter={numericKeyFilter}
          onAccept={onHandleValue('TextField.onAccept')}
        />
        <TextField
          text="Click the icon (KeyUp)"
          icon="#search"
          onKeyUp={onHandleValue('TextField.onKeyUp')}
          onButtonClick={() => console.log('ButtonClick!')}
          onAccept={onHandleValue('TextField.onAccept')}
        />
        <TextField text="Disabled..." enabled={false} />
      </div>
      <div className="row">
        <TextField label="Left" placeholder="With Label..." />
        <TextField
          label="Right"
          labelPosition="right"
          placeholder="With Label..."
        />
        <TextField
          label="Top"
          labelPosition="top"
          placeholder="With Label..."
        />
        <TextField
          label="Bottom"
          labelPosition="bottom"
          placeholder="With Label..."
        />
      </div>
      <div className="row">
        <NumericInput
          label="Integer"
          onChange={onHandleValue('NumericInput.onChange')}
          onAccept={onHandleValue('NumericInput.onAccept')}
        />
        <NumericInput
          allowDecimal={true}
          label="Decimal"
          onChange={onHandleValue('NumericInput.onChange')}
          onAccept={onHandleValue('NumericInput.onAccept')}
        />
        <NumericInput
          enabled={false}
          allowDecimal={true}
          label="Disabled"
          onChange={onHandleValue('NumericInput.onChange')}
          onAccept={onHandleValue('NumericInput.onAccept')}
        />
      </div>
      <div className="row">
        <Select
          label="Mixed"
          options={selectOptionsStandard}
          onBeforeOpen={(options) => {
            selectOpenCount++;
            return options.forEach(
              (option, i) =>
                (option.label = `Option${i + 1} (#${selectOpenCount})`)
            );
          }}
          onChange={onHandleValue('Select.onChange')}
        />
        <Select
          label="Disabled"
          enabled={false}
          options={selectOptionsStandard}
          selectedIndex={0}
          width={80}
          onChange={onHandleValue('Select.onChange')}
        />
        <Select
          label="Long"
          options={selectOptionsLong}
          selectedIndex={0}
          width={150}
          onChange={onHandleValue('Select.onChange')}
        />
      </div>
    </div>
  );
}
