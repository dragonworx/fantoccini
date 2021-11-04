/** @jsx jsx */
import { css, jsx } from '@emotion/react';
import { AbstractButton } from '../../ui/components/abstractButton';
import { HBoxLayout, VBoxLayout } from '../../ui/layout/box';
import { Icon } from '../../ui/components/icon';
import { Label } from '../../ui/components/label';
import { PushButton } from '../../ui/components/pushButton';
import { CheckBox } from '../../ui/components/checkbox';
import { RadioButton } from '../../ui/components/radioButton';
import {
  RadioButtonGroup,
  Option as RadioButtonGroupOption,
} from '../../ui/components/radioButtonGroup';
import {
  ToolButtonGroup,
  Option as ToolButtonGroupOption,
} from '../../ui/components/toolButtonGroup';
import { TextField } from '../../ui/components/textfield';

const radioButtonGroupOptions: RadioButtonGroupOption[] = [
  {
    name: 'option1',
    label: 'Opt1',
    value: 1,
  },
  {
    name: 'option2',
    label: 'Opt3 ++',
    value: 2,
  },
  {
    name: 'option3',
    label: 'Opt3',
    value: 3,
  },
];

const toolButtonGroupOptions: ToolButtonGroupOption[] = [
  {
    name: 'play',
    icon: 'img/icons/play.svg',
  },
  {
    name: 'pause',
    icon: 'img/icons/pause.svg',
  },
  {
    name: 'record',
    icon: 'img/icons/record.svg',
  },
];

const onHandleValue = (label: string) => (value: any) =>
  console.log(`${label}: ${value}`);

const style = css`
  .row {
    padding: 5px 10px;
    display: flex;
    > * {
      margin-right: 5px;
    }

    > *:last-child {
      margin-right: 0;
    }
  }

  .col {
    padding: 10px 5px;
    display: flex;
    flex-direction: column;
    > * {
      margin-bottom: 5px;
    }

    > *:last-child {
      margin-bottom: 0;
    }
  }

  .border {
    outline: 1px solid lime;
  }

  .hsplit {
    display: flex;
    align-items: center;
  }
`;

const createIcons = (width: number = 16, amount: number = 3) => {
  const icons = [];
  for (let i = 0; i < amount; i++) {
    icons.push(<Icon src="img/test.jpg" width={width} />);
  }
  return icons;
};

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
          <Icon src="img/icons/tick.svg" width={32} />
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
            icon="img/icons/record.svg"
            isRound={true}
            iconWidth={16}
            canToggle={true}
          />
          <PushButton icon="img/icons/stop.svg" isRound={true} iconWidth={16} />
          <PushButton
            icon="img/icons/prev-frame.svg"
            isRound={true}
            iconWidth={16}
          />
          <PushButton
            icon="img/icons/play.svg"
            isRound={true}
            iconWidth={16}
            canToggle={true}
            isToggled={true}
          />
          <PushButton
            icon="img/icons/pause.svg"
            isRound={true}
            iconWidth={16}
            canToggle={true}
          />
          <PushButton
            icon="img/icons/next-frame.svg"
            isRound={true}
            iconWidth={16}
          />
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
        />
        <TextField
          placeholder="KeyDown (no 'a'!)..."
          onKeyDown={(key: string) => {
            if (key === 'a') {
              console.log('TextField.onKeyDown but No press "a"!');
              return false;
            }
            onHandleValue('TextField.onKeyDown')(key);
          }}
          onAccept={onHandleValue('TextField.onAccept')}
        />
        <TextField
          placeholder="Filtered (numeric only)..."
          onKeyFilter={(key: string) =>
            ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'].indexOf(key) > -1
          }
          onAccept={onHandleValue('TextField.onAccept')}
        />
        <TextField
          text="Click the icon (KeyUp)"
          icon="img/icons/search.svg"
          onKeyUp={onHandleValue('TextField.onKeyUp')}
          onButtonClick={() => console.log('ButtonClick!')}
          onAccept={onHandleValue('TextField.onAccept')}
        />
        <TextField text="Disabled..." enabled={false} />
      </div>
    </div>
  );
}
