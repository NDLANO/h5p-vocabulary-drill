import React from 'react';

type ComboboxOption = {
  index?: number;
  value: any;
  label: string;
  className: string;
};

type ComboboxProps = {
  id: string;
  className: string;
  label: string;
  active: any;
  options: ComboboxOption[];
  onChange: () => void;
  disabled: boolean;
  ariaLive: string;
};

export const Combobox: React.FC<ComboboxProps> = ({
  id,
  className,
  label,
  active,
  options,
  onChange,
  disabled,
  ariaLive,
}) => {
  const comboRef = React.useRef<HTMLDivElement>(null);
  const listboxRef = React.useRef<HTMLDivElement>(null);

  const activeOption = options.find((option) => option.value === active) ?? options[0];

  const [openMenu, setOpenMenu] = React.useState(false);
  const [selectedOption, setSelectedOption] = React.useState<ComboboxOption>(activeOption);


  const SelectActions = {
    Close: 0,
    CloseSelect: 1,
    First: 2,
    Last: 3,
    Next: 4,
    Open: 5,
    PageDown: 6,
    PageUp: 7,
    Previous: 8,
    Select: 9,
  };

  const handleOpenMenu = () => {
    if (disabled) {
      return;
    }
    setOpenMenu(!openMenu);
  };

  const handleSelectedOption = (option: ComboboxOption) => {
    if (selectedOption.value === option.value) {
      return;
    }
    setSelectedOption(option);
    (listboxRef.current?.querySelector(`${id}-option-${option.index}`) as HTMLOptionElement)?.focus();
  };

  const handleChangeOption = (option: ComboboxOption) => {
    if (active !== option.value) {
      onChange();
    }
    handleSelectedOption(option);
    setOpenMenu(false);
  };

  const getActionFromKey = (event: React.KeyboardEvent<HTMLDivElement>, menuOpen: boolean) => {
    const { key, altKey } = event;
    const openKeys = [' ', 'Enter', 'ArrowDown', 'ArrowUp'];
    const closeKeys = ['Escape', 'Tab'];

    if (!menuOpen && openKeys.includes(key)) {
      return SelectActions.Open;
    }

    if (menuOpen && closeKeys.includes(key)) {
      return SelectActions.Close;
    }

    if (key === 'Home') {
      return SelectActions.First;
    }
    if (key === 'End') {
      return SelectActions.Last;
    }

    if (menuOpen) {
      if (key === 'ArrowUp' && altKey) {
        return SelectActions.CloseSelect;
      }
      else if (key === 'ArrowDown' && !altKey) {
        return SelectActions.Next;
      }
      else if (key === 'ArrowUp') {
        return SelectActions.Previous;
      }
      else if (key === 'PageDown') {
        return SelectActions.PageDown;
      }
      else if (key === 'PageUp') {
        return SelectActions.PageUp;
      }
      else if (key === 'Enter' || key === ' ') {
        return SelectActions.CloseSelect;
      }
    }
    return;
  };

  const getUpdatedIndex = (action: number, currentIndex: number, maxIndex: number) => {
    const pageSize = 10;

    switch (action) {
      case SelectActions.First:
        return 0;
      case SelectActions.Last:
        return maxIndex;
      case SelectActions.Next:
        return Math.min(maxIndex, currentIndex + 1);
      case SelectActions.Previous:
        return Math.max(0, currentIndex - 1);
      case SelectActions.PageDown:
        return Math.min(maxIndex, currentIndex + pageSize);
      case SelectActions.PageUp:
        return Math.max(0, currentIndex - pageSize);
      default:
        return currentIndex;
    }
  };

  const handleComboKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    const action = getActionFromKey(event, openMenu);

    switch (action) {
      case SelectActions.Open:
      case SelectActions.Close:
        event.preventDefault();
        return handleOpenMenu();
      case SelectActions.CloseSelect:
        event.preventDefault();
        return handleChangeOption(selectedOption);
      case SelectActions.First:
      case SelectActions.Last:
      case SelectActions.Next:
      case SelectActions.Previous:
      case SelectActions.PageDown:
      case SelectActions.PageUp:
        event.preventDefault();
        const newIndex = getUpdatedIndex(action, selectedOption.index ?? 0, options.length - 1);
        const newOption = options[newIndex];
        return handleSelectedOption(newOption);
      default:
        return;
    }
  };

  const handleBlur = (event: { relatedTarget: any; }) => {
    if (openMenu) {
      // Blur events are fired before click events, so we need to check if the click was inside the listbox
      const clickedObject = event.relatedTarget;
      if (clickedObject && clickedObject.contains(listboxRef.current)) {
        return;
      }
      setOpenMenu(false);
    }
  };

  return (
    <div className={className}>
      <label id={`${id}-label`} className="visually-hidden combo-label" htmlFor={id}>
        {label}
      </label>
      <div className={`combo ${openMenu ? 'open' : ''} ${activeOption.className} ${disabled ? 'disabled' : ''}`}>
        <div
          aria-controls={`${id}-listbox`}
          aria-expanded={openMenu}
          aria-haspopup="listbox"
          aria-labelledby={`${id}-label`}
          id={id}
          className="combo-input"
          role="combobox"
          tabIndex={disabled ? -1 : 0}
          aria-activedescendant={`${id}-option-${selectedOption.index}`}
          onClick={handleOpenMenu}
          onKeyDown={handleComboKeyDown}
          onBlur={handleBlur}
          ref={comboRef}
        >
          {activeOption.label}
        </div>
        <div
          role="listbox"
          ref={listboxRef}
          className="combo-menu"
          id={`${id}-listbox`}
          aria-labelledby={`${id}-label`}
          onChange={onChange}
          tabIndex={-1}
        >
          {options.map((option, index) => {
            option.index = index;

            return (
              <div
                role="option"
                id={`${id}-option-${index}`}
                key={option.value}
                className={`combo-option ${selectedOption.index === option.index ? 'option-current' : ''}`}
                aria-selected={activeOption.index === option.index}
                onClick={() => handleChangeOption(option)}
                onMouseMove={() => handleSelectedOption(option)}
              >
                {option.label}
              </div>
            );
          })}
        </div>
      </div>
      <div role="region" id={`${id}-listbox`} aria-live="polite" className="visually-hidden">
        {ariaLive}
      </div>
    </div>
  );
};
