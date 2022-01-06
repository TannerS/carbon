/**
 * Copyright IBM Corp. 2016, 2018
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import PropTypes from 'prop-types';
import React, { useState } from 'react';
import classNames from 'classnames';
import { WarningFilled16 } from '@carbon/icons-react';
import { useFeatureFlag } from '../FeatureFlags';
import { usePrefix } from '../../internal/usePrefix';

const TextArea = React.forwardRef(function TextArea(
  {
    className,
    id,
    labelText,
    hideLabel,
    onChange,
    onClick,
    invalid,
    invalidCounterText,
    invalidText,
    helperText,
    light,
    placeholder,
    enableCounter,
    maxCount,
    ...other
  },
  ref
) {
  const prefix = usePrefix();
  const enabled = useFeatureFlag('enable-v11-release');
  const { defaultValue, disabled } = other;
  const [textCount, setTextCount] = useState(defaultValue?.length || 0);
  const [isInvalidCount, setIsInvalidCount] = useState(false);

  const isValid = () => invalid || isInvalidCount;

  const handleCounterChange = (evt) => {
    const currentCount = evt.target.value?.length || 0;

    if (enableCounter && currentCount > maxCount) {
      setIsInvalidCount(true);
    } else {
      setIsInvalidCount(false);
    }

    setTextCount(currentCount);
  };

  const textareaProps = {
    id,
    onChange: (evt) => {
      if (!other.disabled) {
        handleCounterChange(evt);
        onChange(evt);
      }
    },
    onClick: (evt) => {
      if (!other.disabled) {
        onClick(evt);
      }
    },
    ref,
  };

  const labelClasses = classNames(`${prefix}--label`, {
    [`${prefix}--visually-hidden`]: hideLabel,
    [`${prefix}--label--disabled`]: disabled,
  });

  const label = labelText ? (
    <label htmlFor={id} className={labelClasses}>
      {labelText}
    </label>
  ) : null;

  const counterClasses = classNames(`${prefix}--label`, {
    [`${prefix}--label--disabled`]: disabled,
    [`${prefix}--text-area__counter`]: true,
  });

  const counter =
    enableCounter && maxCount ? (
      <div className={counterClasses}>{`${textCount}/${maxCount}`}</div>
    ) : null;

  const helperTextClasses = classNames(`${prefix}--form__helper-text`, {
    [`${prefix}--form__helper-text--disabled`]: other.disabled,
  });

  const helper = helperText ? (
    <div className={helperTextClasses}>{helperText}</div>
  ) : null;

  const errorId = id + '-error-msg';

  const error = isValid() ? (
    <div role="alert" className={`${prefix}--form-requirement`} id={errorId}>
      {invalid ? invalidText : invalidCounterText}
    </div>
  ) : null;

  const textareaClasses = classNames(
    `${prefix}--text-area`,
    [enabled ? null : className],
    {
      [`${prefix}--text-area--light`]: light,
      [`${prefix}--text-area--invalid`]: isValid(),
    }
  );

  const input = (
    <textarea
      {...other}
      {...textareaProps}
      placeholder={placeholder || null}
      className={textareaClasses}
      aria-invalid={isValid() || null}
      aria-describedby={isValid() ? errorId : null}
      disabled={other.disabled}
    />
  );

  return (
    <div
      className={
        enabled
          ? classNames(`${prefix}--form-item`, className)
          : `${prefix}--form-item`
      }>
      <div className={`${prefix}--text-area__counter-wrapper`}>
        {label}
        {counter}
      </div>
      <div
        className={`${prefix}--text-area__wrapper`}
        data-invalid={isValid() || null}>
        {isValid() && (
          <WarningFilled16 className={`${prefix}--text-area__invalid-icon`} />
        )}
        {input}
      </div>
      {isValid() ? error : helper}
    </div>
  );
});

TextArea.displayName = 'TextArea';
TextArea.propTypes = {
  /**
   * Provide a custom className that is applied directly to the underlying
   * `<textarea>` node
   */
  className: PropTypes.string,

  /**
   * Specify the `cols` attribute for the underlying `<textarea>` node
   */
  cols: PropTypes.number,

  /**
   * Optionally provide the default value of the `<textarea>`
   */
  defaultValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),

  /**
   * Specify whether the control is disabled
   */
  disabled: PropTypes.bool,

  /**
   * Specify whether to display the character counter
   */
  enableCounter: PropTypes.bool,

  /**
   * Provide text that is used alongside the control label for additional help
   */
  helperText: PropTypes.node,

  /**
   * Specify whether you want the underlying label to be visually hidden
   */
  hideLabel: PropTypes.bool,

  /**
   * Provide a unique identifier for the control
   */
  id: PropTypes.string,

  /**
   * Specify whether the control is currently invalid
   */
  invalid: PropTypes.bool,

  /**
   * Provide the text that is displayed when the user types more than the max
   */
  invalidCounterText: PropTypes.node,

  /**
   * Provide the text that is displayed when the control is in an invalid state
   */
  invalidText: PropTypes.node,

  /**
   * Provide the text that will be read by a screen reader when visiting this
   * control
   */
  labelText: PropTypes.node.isRequired,

  /**
   * `true` to use the light version. For use on $ui-01 backgrounds only.
   * Don't use this to make tile background color same as container background color.
   */
  light: PropTypes.bool,

  /**
   * Max character count allowed for the textarea. This is needed in order for enableCounter to display
   */
  maxCount: PropTypes.number,

  /**
   * Optionally provide an `onChange` handler that is called whenever `<textarea>`
   * is updated
   */
  onChange: PropTypes.func,

  /**
   * Optionally provide an `onClick` handler that is called whenever the
   * `<textarea>` is clicked
   */
  onClick: PropTypes.func,

  /**
   * Specify the placeholder attribute for the `<textarea>`
   */
  placeholder: PropTypes.string,

  /**
   * Specify the rows attribute for the `<textarea>`
   */
  rows: PropTypes.number,

  /**
   * Provide the current value of the `<textarea>`
   */
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

TextArea.defaultProps = {
  disabled: false,
  onChange: () => {},
  onClick: () => {},
  placeholder: '',
  rows: 4,
  cols: 50,
  invalid: false,
  invalidCounterText: '',
  invalidText: '',
  helperText: '',
  light: false,
  enableCounter: false,
  maxCount: undefined,
};

export default TextArea;
