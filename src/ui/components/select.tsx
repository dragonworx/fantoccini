/** @jsx jsx */
import { css, jsx } from '@emotion/react';
import { useState, useEffect, useRef, KeyboardEvent } from 'react';
import { Label, LabelPosition } from './label';
import { Icon } from './icon';
import { AbstractButton } from './abstractButton';
import {
  isOptionEnabled,
  Menu,
  MenuOption,
  OptionUpdateHandler,
  optionSelectBlinkInterval,
  optionSelectBlinkRepeat,
} from './menu';
import { HBoxLayout } from '../layout/box';
import { init, multiFire } from './util';

export interface Props {
  enabled?: boolean;
  width?: number;
  label?: string;
  labelPosition?: LabelPosition;
  options: MenuOption[];
  selectedIndex?: number;
  onBeforeOpen?: OptionUpdateHandler;
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

    & .buttoncontent {
      & label,
      & .label {
        text-overflow: ellipsis;
        overflow: hidden;
        flex-grow: 1;
      }
    }

    & .bar {
      position: absolute;
      height: 90%;
      width: 1px;
      border-left: 1px solid #444;
      border-right: 1px solid #222;
      right: 25px;
    }
  `;
};

export function Select(props: Props) {
  const [
    { enabled, label, labelPosition, options, selectedIndex, onBeforeOpen },
    css,
  ] = init(props, defaultProps, style);

  const [isToggled, setIsToggled] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(selectedIndex);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => setCurrentIndex(selectedIndex), [selectedIndex]);

  const labelText =
    currentIndex === -1
      ? ''
      : options[currentIndex].label || `${options[currentIndex].label}`;

  const onSelectHandler = (selectedIndex: number) => {
    setCurrentIndex(selectedIndex);
    setIsToggled(false);
  };

  const onToggledHandler = (isCurrentlyToggled: boolean) => {
    setIsToggled(isCurrentlyToggled);
  };

  const incrementCurrentIndex = (
    incrementAmount: number,
    e?: KeyboardEvent
  ) => {
    const lastIndex = options.length - 1;
    e && e.preventDefault();
    if (incrementAmount === -1) {
      for (let i = currentIndex - 1; i >= 0; i--) {
        if (isOptionEnabled(options[i])) {
          setCurrentIndex(i);
          return;
        }
      }
    } else {
      for (let i = currentIndex + 1; i <= lastIndex; i++) {
        if (isOptionEnabled(options[i])) {
          setCurrentIndex(i);
          return;
        }
      }
    }
  };

  const onKeyDownHandler = (e: KeyboardEvent) => {
    const { key } = e;
    if (key === 'ArrowUp') {
      incrementCurrentIndex(-1, e);
    } else if (key === 'ArrowDown') {
      if (isToggled) {
        incrementCurrentIndex(1, e);
      } else {
        setIsToggled(true);
      }
    } else if (key === 'Escape') {
      setIsToggled(false);
    } else if (key === 'Tab') {
      setIsToggled(false);
    } else if (key === ' ' || key === 'Enter') {
      const current = ref.current;
      if (current) {
        const li = current.querySelector('li.selected')!;
        const index = parseFloat(li.getAttribute('data-index')!);
        const option = options[index];
        if (option.enabled !== false) {
          multiFire(
            (done) => {
              li.classList.add('selected');
              setTimeout(() => {
                li.classList.remove('selected');
                done();
              }, optionSelectBlinkInterval);
            },
            optionSelectBlinkRepeat,
            optionSelectBlinkInterval
          ).then(() => {
            if (option.type === 'checked') {
              option.value = !option.value;
            }
            onSelectHandler(index);
          });
        }
      }
      return false;
    }
  };

  const onBlurHandler = () => {
    setIsToggled(false);
  };

  return (
    <div className="select" ref={ref}>
      <Label text={label} position={labelPosition}>
        <div css={css}>
          <Menu
            isOpen={isToggled}
            options={options}
            selectedIndex={currentIndex}
            onSelect={onSelectHandler}
            onBlur={onBlurHandler}
            onBeforeOpen={onBeforeOpen}
          >
            <AbstractButton
              enabled={enabled}
              height={height}
              canToggle={true}
              toggleMode="binary"
              isToggled={isToggled}
              toggleOnDown={true}
              onToggled={onToggledHandler}
              onKeyDown={onKeyDownHandler}
            >
              <HBoxLayout height={height}>
                <Label enabled={enabled} text={labelText} justify="start" />
                <Icon enabled={enabled} src="#select" width={iconHeight} />
              </HBoxLayout>
              <div className="bar"></div>
            </AbstractButton>
          </Menu>
        </div>
      </Label>
    </div>
  );
}
