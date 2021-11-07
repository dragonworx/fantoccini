/** @jsx jsx */
import { css, jsx } from '@emotion/react';
import { useState, useEffect } from 'react';
import { Label, LabelPosition } from './label';
import { Icon } from './icon';
import { AbstractButton } from './abstractButton';
import { HBoxLayout } from '../layout/box';
import { init } from './util';

export interface SelectOption {
  label?: string;
  value: any;
}

export interface Props {
  enabled?: boolean;
  width?: number;
  label?: string;
  labelPosition?: LabelPosition;
  options: SelectOption[];
  selectedIndex?: number;
}

export const defaultProps: Props = {
  enabled: true,
  width: 100,
  labelPosition: 'left',
  options: [],
  selectedIndex: -1,
};

const height = 25;
const iconHeight = Math.round(height / 2);

export const style = ({ width }: Required<Props>) => {
  return css`
    width: ${width}px;
    height: ${height}px;

    & .button-content label,
    & .button-content .label {
      text-overflow: ellipsis;
      overflow: hidden;
      flex-grow: 1;
    }
  `;
};

export function Select(props: Props) {
  const [{ enabled, label, labelPosition, options, selectedIndex }, css] = init(
    props,
    defaultProps,
    style
  );

  const [isToggled, setIsToggled] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(selectedIndex);
  useEffect(() => setCurrentIndex(selectedIndex), [selectedIndex]);

  const onClickHandler = () => {
    setIsToggled(true);
  };

  const onBlurHandler = () => {
    setIsToggled(false);
  };

  const labelText =
    currentIndex === -1
      ? ''
      : options[currentIndex].label || `${options[currentIndex].label}`;

  return (
    <div className="select">
      <Label text={label} position={labelPosition}>
        <div css={css}>
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
              <Label enabled={enabled} text={labelText} justify="start" />
              <Icon enabled={enabled} src="#select" width={iconHeight} />
            </HBoxLayout>
          </AbstractButton>
        </div>
      </Label>
    </div>
  );
}
