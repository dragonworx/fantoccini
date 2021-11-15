/** @jsx jsx */
import { css, jsx } from '@emotion/react';
import { useState, useEffect, useRef, KeyboardEvent } from 'react';
import { Label, LabelPosition } from './label';
import { Icon } from './icon';
import { AbstractButton, Appearance } from './abstractButton';
import {
  isItemEnabled,
  Menu,
  ItemUpdateHandler,
  itemSelectBlinkInterval,
  itemSelectBlinkRepeat,
  MenuItem,
} from './menu';
import { HBoxLayout } from '../layout/box';
import { init, multiFire } from './util';

export interface Props {
  enabled?: boolean;
  width?: number;
  label?: string;
  labelPosition?: LabelPosition;
  options: MenuItem[];
  selectedIndex?: number;
  appearance?: Appearance;
  onBeforeOpen?: ItemUpdateHandler;
  onChange?: (selectedValueOrIndex: any) => void;
}

export const defaultProps: Props = {
  enabled: true,
  width: 100,
  labelPosition: 'left',
  options: [],
  selectedIndex: -1,
  appearance: 'full',
};

const height = 25;
const iconHeight = Math.round(height / 2);

export const style =
  (isToggled: boolean) =>
  ({ width, appearance }: Required<Props>) => {
    if (appearance === 'bare') {
      return css`
        background: ${isToggled
          ? 'linear-gradient(180deg,#222 0,#2f343c 100%)'
          : 'transparent'};
      `;
    }
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
  const [isToggled, setIsToggled] = useState(false);

  const [
    {
      enabled,
      label,
      labelPosition,
      options,
      selectedIndex,
      appearance,
      onBeforeOpen,
      onChange,
    },
    cssStyle,
  ] = init(props, defaultProps, style(isToggled));

  const [currentIndex, setCurrentIndex] = useState(selectedIndex);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => setCurrentIndex(selectedIndex), [selectedIndex]);

  const labelText =
    appearance === 'bare'
      ? label
      : currentIndex === -1
      ? ''
      : options[currentIndex].label || `${options[currentIndex].label}`;

  const onSelectHandler = (selectedIndex: number) => {
    setCurrentIndex(selectedIndex);
    setIsToggled(false);
    onChange && onChange(options[selectedIndex].value || selectedIndex);
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
      for (
        let i = currentIndex === -1 ? lastIndex : currentIndex - 1;
        i >= 0;
        i--
      ) {
        if (isItemEnabled(options[i])) {
          setCurrentIndex(i);
          return;
        }
      }
    } else {
      for (
        let i = currentIndex === -1 ? 0 : currentIndex + 1;
        i <= lastIndex;
        i++
      ) {
        if (isItemEnabled(options[i])) {
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
    }
  };

  const onKeyUpHandler = (e: KeyboardEvent) => {
    const { key } = e;
    if ((key === ' ' || key === 'Enter') && isToggled) {
      const current = ref.current;
      if (current) {
        const li = current.querySelector('li.selected');
        if (li === null) {
          return;
        }
        const index = parseFloat(li.getAttribute('data-index')!);
        const option = options[index];
        if (option.enabled !== false) {
          multiFire(
            (done) => {
              li.classList.add('selected');
              setTimeout(() => {
                li.classList.remove('selected');
                done();
              }, itemSelectBlinkInterval);
            },
            itemSelectBlinkRepeat,
            itemSelectBlinkInterval
          ).then(() => {
            if (option.type === 'checked') {
              option.value = !option.value;
            }
            li.classList.add('selected');
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
      <Label
        text={label}
        position={appearance === 'bare' ? 'hidden' : labelPosition}
        appearance={appearance}
      >
        <div css={cssStyle}>
          <Menu
            isOpen={isToggled}
            items={options}
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
              appearance={appearance}
              onToggled={onToggledHandler}
              onKeyDown={onKeyDownHandler}
              onKeyUp={onKeyUpHandler}
            >
              <HBoxLayout height={height} margin={0} spacing={0}>
                <Label
                  enabled={enabled}
                  text={labelText}
                  justify="start"
                  appearance={appearance}
                />
                {appearance === 'full' ? (
                  <Icon enabled={enabled} src="#select" width={iconHeight} />
                ) : null}
              </HBoxLayout>
              {appearance === 'full' ? <div className="bar"></div> : null}
            </AbstractButton>
          </Menu>
        </div>
      </Label>
    </div>
  );
}
