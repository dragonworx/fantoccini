/** @jsx jsx */
import { jsx } from '@emotion/react';
import {
  style,
  createIcons,
  onHandleValue,
  radioButtonGroupOptions,
  selectOptionsStandard,
  selectOptionsLong,
  toolButtonGroupOptions,
  menuBarItems,
  HSplit,
  Outline,
  Column,
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
import { MenuBar } from '../../ui/components/menuBar';
import { Panel } from '../../ui/components/panel';
import { ToolTip } from '../../ui/components/tooltip';
import { Section } from '../../ui/layout/section';
import { Spacer } from '../../ui/layout/spacer';
import { ScrollBar } from '../../ui/components/scrollBar';

let selectOpenCount = 0;

export function App() {
  return (
    <div css={style}>
      <HSplit>
        <Section title="Label">
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
        </Section>
        <Section title="Icon">
          <Icon src="#tick" width={32} />
          <Icon src="img/test.jpg" width={32} border={true} />
        </Section>
        <Section title="HBoxLayout">
          <Outline>
            <HBoxLayout>{createIcons()}</HBoxLayout>
          </Outline>
        </Section>
        <Section title="VBoxLayout" justify="center">
          <Outline>
            <VBoxLayout>{createIcons()}</VBoxLayout>
          </Outline>
        </Section>
      </HSplit>
      <HSplit>
        <Section title="AbstractButton">
          <AbstractButton isRound={true}></AbstractButton>
          <AbstractButton enabled={false}></AbstractButton>
          <AbstractButton canToggle={true}></AbstractButton>
          <AbstractButton canToggle={true} isToggled={true}></AbstractButton>
        </Section>
        <Section title="PushButton">
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
        </Section>
      </HSplit>
      <HSplit>
        <Section title="PushButton">
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
        </Section>
        <Section title="CheckBox">
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
        </Section>
      </HSplit>
      <Section title="RadioButton">
        <RadioButton />
        <RadioButton label="Disabled" enabled={false} />
        <RadioButton label="Click!" onToggled={() => console.log('Toggled!')} />
        <RadioButton label="Left" labelPosition="left" />
        <RadioButton label="Right" labelPosition="right" />
        <RadioButton label="Bottom" labelPosition="bottom" />
        <RadioButton label="Top" labelPosition="top" />
      </Section>
      <Section title="RadioButtonGroup">
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
        <Column>
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
        </Column>
      </Section>
      <Section title="ToolButtonGroup">
        <ToolButtonGroup
          options={toolButtonGroupOptions}
          onClick={(name: string) => console.log('Tool', name)}
        />
      </Section>
      <Section title="TextField">
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
      </Section>
      <Section title="TextField">
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
      </Section>
      <Section title="NumericInput">
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
      </Section>
      <Section title="Select">
        <Select
          label="Standard"
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
      </Section>
      <Section title="MenuBar">
        <MenuBar items={menuBarItems} />
      </Section>
      <Section title="Panel">
        <Panel>
          <Label text="Simple" />
        </Panel>
        <Panel title="The Title">
          <Label text="With Title" />
        </Panel>
        <Panel title="With MenuBar" menu={menuBarItems}>
          <Label text="Content" />
        </Panel>
      </Section>
      <Section title="ToolTip">
        <ToolTip text="Here's a tip!">
          <Label text="Below" />
        </ToolTip>
        <Spacer />
        <ToolTip text="Here's a tip!" position="above">
          <Label text="Above" />
        </ToolTip>
        <Spacer />
        <ToolTip text="Here's a tip!" position="right">
          <Label text="Right" />
        </ToolTip>
        <Spacer />
        <ToolTip text="Here's a tip!" position="left">
          <Label text="Left" />
        </ToolTip>
      </Section>
      <Section title="ScrollBar">
        <ScrollBar
          outerSize={100}
          innerSize={10}
          value={0.9}
          onChange={onHandleValue('ScrollBar.onChange')}
        />
      </Section>
    </div>
  );
}
