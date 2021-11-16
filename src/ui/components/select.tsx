/** @jsx jsx */
import { css, jsx } from '@emotion/react';
import { useState, useEffect, useRef, KeyboardEvent, MouseEvent } from 'react';
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
import { getCss, getProps, init, multiFire } from './util';

export interface Props {
  enabled?: boolean;
  width?: number;
  label?: string;
  labelPosition?: LabelPosition;
  options: MenuItem[];
  selectedIndex?: number;
  appearance?: Appearance;
  isOpen?: boolean;
  onBeforeOpen?: ItemUpdateHandler;
  onChange?: (selectedValueOrIndex: any) => void;
  onToggled?: (isToggled: boolean) => void;
  onMouseOver?: (e: MouseEvent) => void;
  onMouseOut?: (e: MouseEvent) => void;
  onClosed?: () => void;
}

export const defaultProps: Props = {
  enabled: true,
  width: 100,
  labelPosition: 'left',
  options: [],
  selectedIndex: -1,
  appearance: 'full',
  isOpen: false,
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
        & label {
          text-overflow: ellipsis;
          overflow: hidden;
        }

        & .label {
          flex-grow: 1;
          max-width: calc(95% - 30px);
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
  const {
    enabled,
    label,
    labelPosition,
    options,
    selectedIndex,
    appearance,
    isOpen,
    onBeforeOpen,
    onChange,
    onMouseOver,
    onMouseOut,
    onToggled,
    onClosed,
  } = getProps(props, defaultProps);

  const [isToggled, setIsToggled] = useState(isOpen);
  useEffect(() => setIsToggled(isOpen), [isOpen]);

  const cssStyle = getCss(style(isToggled), props, defaultProps);

  const [currentIndex, setCurrentIndex] = useState(selectedIndex);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => setCurrentIndex(selectedIndex), [selectedIndex]);

  const labelText =
    appearance === 'bare'
      ? label
      : currentIndex === -1
      ? ''
      : options[currentIndex].label || `${options[currentIndex].label}`;

  const onSelectHandler = (item: MenuItem) => {
    const index = options.indexOf(item);
    setIsToggled(false);
    if (appearance !== 'bare') {
      setCurrentIndex(index);
    }
    if (item.type !== 'menu') {
      onChange && onChange(item.value || index);
    }
  };

  const onToggledHandler = (isCurrentlyToggled: boolean) => {
    setIsToggled(isCurrentlyToggled);
    onToggled && onToggled(isCurrentlyToggled);
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
            onSelectHandler(option);
          });
        }
      }
      return false;
    }
  };

  const onBlurHandler = () => {
    setIsToggled(false);
  };

  const onMouseOverHandler = (e: MouseEvent) => {
    onMouseOver && onMouseOver(e);
  };

  const onMouseOutHandler = (e: MouseEvent) => {
    onMouseOut && onMouseOut(e);
  };

  const onClosedHandler = () => {
    onClosed && onClosed();
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
            onClosed={onClosedHandler}
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
              onMouseOver={onMouseOverHandler}
              onMouseOut={onMouseOutHandler}
            >
              <HBoxLayout
                height={height}
                margin={0}
                spacing={0}
                justify="space-around"
              >
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
