/** @jsx jsx */
import { css, jsx } from '@emotion/react';
import { AbstractButton } from '../../ui/components/abstractButton';
import { HBoxLayout, VBoxLayout } from '../../ui/layout/box';
import { Icon } from '../../ui/components/icon';
import { Label } from '../../ui/components/label';
import { PushButton } from '../../ui/components/pushButton';
import { CheckBox } from '../../ui/components/checkbox';
import { RadioButton } from '../../ui/components/radioButton';

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

  .border {
    outline: 1px solid lime;
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
      <div className="row">
        <Label text="Label Enabled" />
        <Label
          text="Label Disabled"
          enabled={false}
          onClick={() => alert('Should not be clicked!')}
        />
        <Label
          text="Label Link"
          link={true}
          onClick={() => alert('Clicked!')}
        />
        <Label
          text="Label Link Disabled"
          link={true}
          enabled={false}
          onClick={() => alert('Should not be clicked!')}
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
      <div className="row">
        <AbstractButton round={true}></AbstractButton>
        <AbstractButton enabled={false}></AbstractButton>
        <AbstractButton toggle={true}></AbstractButton>
        <AbstractButton toggle={true} isToggled={true}></AbstractButton>
      </div>
      <div className="row">
        <PushButton onClick={() => alert('Clicked!')} label="Enabled" />
        <PushButton
          onClick={() => alert('Should not be clicked!')}
          label="Disabled"
          enabled={false}
        />
        <PushButton label="With Icon" icon="img/test.jpg" iconWidth={20} />
        <PushButton
          label="Toggle Enabled"
          toggle={true}
          onToggled={(isToggled: boolean) => isToggled && alert('Is Toggled!')}
        />
        <PushButton
          label="Toggle Disabled"
          enabled={false}
          toggle={true}
          onClick={() => alert('Should not be clicked!')}
        />
      </div>
      <div className="row">
        <CheckBox />
        <CheckBox enabled={false} />
        <CheckBox style={'tick'} />
        <CheckBox label="Label" />
        <CheckBox label="Left" labelPosition="left" />
        <CheckBox label="Right" labelPosition="right" />
        <CheckBox label="Bottom" labelPosition="bottom" />
        <CheckBox label="Top" labelPosition="top" />
      </div>
      <div className="row">
        <RadioButton />
        <RadioButton enabled={false} />
        <RadioButton label="Label" />
        <RadioButton label="Left" labelPosition="left" />
        <RadioButton label="Right" labelPosition="right" />
        <RadioButton label="Bottom" labelPosition="bottom" />
        <RadioButton label="Top" labelPosition="top" />
      </div>
    </div>
  );
}
