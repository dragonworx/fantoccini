/** @jsx jsx */
import { css, jsx } from '@emotion/react';
import { Button } from '../../ui/button';
import { Icon } from '../../ui/icon';

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
        <Button onClick={() => alert('Clicked!')}>Click this now!</Button>
        <Button onClick={() => alert('Clicked!')} enabled={false}>
          Click this now!
        </Button>
        <Button>
          <Icon src="img/test.jpg" width={20} /> With Icon
        </Button>
      </div>
    </div>
  );
}
