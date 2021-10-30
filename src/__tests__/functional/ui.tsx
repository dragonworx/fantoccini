/** @jsx jsx */
import { css, jsx } from '@emotion/react';
import { AbstractButton } from '../../ui/components/abstractButton';
import { HBoxLayout, VBoxLayout } from '../../ui/layout/box';
import { Icon } from '../../ui/components/icon';
import { Label } from '../../ui/components/label';
import { PushButton } from '../../ui/components/pushButton';
import { CheckBox } from '../../ui/components/checkbox';
import { RadioButton } from '../../ui/components/radioButton';
import { RadioButtonGroup } from '../../ui/components/radioButtonGroup';

const radioButtonGroupOptions = [
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

const onRadioGroupChange = (value: any) => console.log('RadioGroup', value);

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
          onChange={onRadioGroupChange}
        />
        <RadioButtonGroup
          options={radioButtonGroupOptions}
          labelPosition="left"
          onChange={onRadioGroupChange}
        />
        <RadioButtonGroup
          options={radioButtonGroupOptions}
          labelPosition="top"
          onChange={onRadioGroupChange}
        />
        <RadioButtonGroup
          enabled={false}
          options={radioButtonGroupOptions}
          selectedValue={3}
          labelPosition="bottom"
          onChange={onRadioGroupChange}
        />
        <div className="col">
          <RadioButtonGroup
            options={radioButtonGroupOptions}
            direction="horizontal"
            labelPosition="left"
            onChange={onRadioGroupChange}
          />
          <RadioButtonGroup
            options={radioButtonGroupOptions}
            direction="horizontal"
            labelPosition="right"
            onChange={onRadioGroupChange}
          />
        </div>
      </div>
    </div>
  );
}
