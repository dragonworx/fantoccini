/** @jsx jsx */
import { css, jsx } from '@emotion/react';
import { useState } from 'react';
import { Label, LabelPosition } from './label';
import { Icon } from './icon';
import { AbstractButton } from './abstractButton';
import { HBoxLayout } from '../layout/box';
import { init } from './util';

export type Props = {
  enabled?: boolean;
  width?: number;
  label?: string;
  labelPosition?: LabelPosition;
};

export const defaultProps: Props = {
  enabled: true,
  width: 150,
  labelPosition: 'left',
};

const height = 25;
const iconHeight = Math.round(height / 2);

export const style = ({ enabled, width }: Required<Props>) => {
  return css`
    min-width: ${width}px;
    height: ${height}px;

    & .label {
      flex-grow: 1;

      & .button-content label {
        max-width: ${width - 41}px;
        text-overflow: ellipsis;
        overflow: hidden;
      }
    }
  `;
};

export function Select(props: Props) {
  const [{ enabled, label, labelPosition }, css] = init(
    props,
    defaultProps,
    style
  );

  const [isToggled, setIsToggled] = useState(false);

  const onClickHandler = () => {
    console.log('!');
    setIsToggled(true);
  };

  const onBlurHandler = () => {
    console.log('@');
    setIsToggled(false);
  };

  return (
    <div css={css} className="select">
      <Label text={label} position={labelPosition}>
        <AbstractButton
          enabled={enabled}
          height={height}
          canToggle={true}
          toggleMode="binary"
          isToggled={isToggled}
          onClick={onClickHandler}
          onBlur={onBlurHandler}
        >
          <HBoxLayout height={height}>
            <Label enabled={enabled} text="Test as ds ds " justify="start" />
            <Icon enabled={enabled} src="#select" width={iconHeight} />
          </HBoxLayout>
        </AbstractButton>
      </Label>
    </div>
  );
}
