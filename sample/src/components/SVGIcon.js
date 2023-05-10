import React from 'react';
import { View } from 'react-native';

import AppleIcon from '../assets/svg/ic-apple.svg';
import ArrowDownIcon from '../assets/svg/ic-arrow-down.svg';
import ArrowLeftIcon from '../assets/svg/ic-arrow-left.svg';
import ArrowRightIcon from '../assets/svg/ic-arrow-right.svg';
import CalendarIcon from '../assets/svg/ic-calendar.svg';
import CloseIcon from '../assets/svg/ic-close.svg';
import FacebookIcon from '../assets/svg/ic-facebook.svg';
import GoogleIcon from '../assets/svg/ic-google.svg';
import ParticipantIcon from '../assets/svg/ic-pts.svg';
import SeparatorIcon from '../assets/svg/ic-separator.svg';

const SVGIcon = ({ name, svgProps, style = {} }) => {
  let IconComponent = null;
  switch (name) {
    case 'ic-facebook':
      IconComponent = FacebookIcon;
      break;
    case 'ic-apple':
      IconComponent = AppleIcon;
      break;
    case 'ic-google':
      IconComponent = GoogleIcon;
      break;
    case 'ic-calendar':
      IconComponent = CalendarIcon;
      break;
    case 'ic-pts':
      IconComponent = ParticipantIcon;
      break;
    case 'ic-close':
      IconComponent = CloseIcon;
      break;
    case 'ic-arrow-left':
      IconComponent = ArrowLeftIcon;
      break;
    case 'ic-arrow-right':
      IconComponent = ArrowRightIcon;
      break;
    case 'ic-arrow-down':
      IconComponent = ArrowDownIcon;
      break;
    case 'ic-separator':
      IconComponent = SeparatorIcon;
      break;
  }
  return IconComponent == null ? null : (
    <View style={{ ...style }}>
      <IconComponent {...svgProps} />
    </View>
  );
};

export default SVGIcon;
