/** @jsx jsx */
import { css, jsx } from '@emotion/react';
import { AbstractButton } from '../../ui/abstractButton';
import { Icon } from '../../ui/icon';
import { Label } from '../../ui/label';
import { PushButton } from '../../ui/pushButton';

const style = css`
  .row {
    padding: 10px;
    display: flex;
    > * {
      margin-right: 10px;
    }

    > *:last-child {
      margin-right: 0;
    }
  }
`;

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
        <Icon src="img/test.jpg" width={32} />
        <Icon src="img/test.jpg" width={32} border={true} />
      </div>
      <div className="row">
        <AbstractButton></AbstractButton>
        <AbstractButton enabled={false}></AbstractButton>
        <AbstractButton toggle={true}></AbstractButton>
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
    </div>
  );
}
