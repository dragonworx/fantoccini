/** @jsx jsx */
import { css, jsx } from '@emotion/react';
import { Button } from '../../ui/button';
import { Icon } from '../../ui/icon';
import { Label } from '../../ui/label';

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
        <Button onClick={() => alert('Clicked!')}>Click this now!</Button>
        <Button onClick={() => alert('Should not be clicked!')} enabled={false}>
          Click this now!
        </Button>
        <Button>
          <Icon src="img/test.jpg" width={20} /> With Icon
        </Button>
      </div>
    </div>
  );
}
